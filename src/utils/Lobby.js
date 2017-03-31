class Lobby
{
  /**
   * @param {firebase.database.Reference}dbRef
   */
  constructor (dbRef)
  {
    this._dbRef = dbRef;

    this._key = this._dbRef.key;
    this._name = this._dbRef.name;
    this._owner = this._dbRef.owner;
    this._players = this._dbRef.players;

    this._eventsStorage = {};

    this._addEventsListeners();
  }

  _addEventsListeners ()
  {
    this._onChange();
  }

  _onChange ()
  {
    this._dbRef.on('value', (snapshot) =>
    {
      if (snapshot.exists() === false)
      {
        return;
      }

      let data = snapshot.val();
      this._key = snapshot.key;
      this._name = data.name;
      this._owner = data.owner;
      this._players = data.players;

      if (this._eventsStorage['change']) this._eventsStorage['change'].forEach((event) => event(data));
    });
  }

  get key ()
  {
    return this._key;
  }

  get name ()
  {
    return this._name;
  }

  set name (name)
  {
    if (typeof name !== 'string' || !name) throw new TypeError('name must be a non-empty string');

    this._name = name;
    this._dbRef.set({name: name});
  }

  get owner ()
  {
    return this._owner;
  }

  set owner (ownerKey)
  {
    if (typeof ownerKey !== 'string' || !ownerKey) throw new TypeError('ownerKey must be a non-empty string.');

    this._owner = ownerKey;
    this._dbRef.set({owner: ownerKey});
  }

  get players ()
  {
    return this._players;
  }

  on (type, callback)
  {
    if (typeof type !== 'string' || !type) throw new TypeError('Type of event must be a non-empty string.');
    if (typeof callback !== 'function') throw new TypeError('Callback must be a function.');

    if (typeof this._eventsStorage[type] === 'undefined')
    {
      this._eventsStorage[type] = [];
    }

    this._eventsStorage[type].push(callback);

    return this;
  }

  off (type, callback)
  {
    if (typeof type !== 'string' || !type) throw new TypeError('Type of event must be a non-empty string.');
    if (typeof callback !== 'function') throw new TypeError('Callback must be a function.');

    let index = this._eventsStorage[type].indexOf(callback);

    if (index === -1)
    {
      return null;
    }

    this._eventsStorage[type].splice(index, 1);
  }
}

export default Lobby;
