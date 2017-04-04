import Lobby from './Lobby';

class Lobbies
{
  /**
   *
   * @param {firebase.database.Reference} database
   */
  constructor (database)
  {
    this._dbRef = database.ref('lobbies');

    this._lobbies = new Map();

    this._eventsStorage = {};

    this._addEventsListeners();
  }

  /**
   * Creates new Lobby instance.
   *
   * @param {String} name
   * @param {User} owner
   * @returns {Lobbies}
   */
  createLobby (name, owner)
  {
    if (typeof name !== 'string' || !name) throw new TypeError('name must be a non-empty string');

    let lobby = this._dbRef.push({
      name: name,
      owner: owner.key,
      players: {
        [owner.key]: owner.name
      },

      gameType: 'deathmatch',
      map: 'lul'
    });

    this._lobbies.set(lobby.key, new Lobby(lobby));

    return lobby;
  }

  get (key)
  {
    return this._lobbies.get(key);
  }

  /**
   * .forEach invoked on Map of lobbies (Lobby.key, Lobby)
   *
   * @param {Function} callback
   * @return void
   */
  forEach (callback)
  {
    this._lobbies.forEach((value, key, map) => callback);
  }

  _addEventsListeners ()
  {
    this._onNewLobby();
    this._onRemoveLobby();
  }

  _onNewLobby ()
  {
    this._dbRef.on('child_added', (snapshot) =>
    {
      let lobby = new Lobby(snapshot.ref);
      this._lobbies.set(snapshot.key, lobby);

      if (this._eventsStorage['create']) this._eventsStorage['create'].forEach((event) => event(lobby));
    });
  }

  _onRemoveLobby ()
  {
    this._dbRef.on('child_removed', (snapshot) =>
    {
      if (this._eventsStorage['remove']) this._eventsStorage['remove'].forEach((event) => event(this._lobbies.get(snapshot.key)));

      this._lobbies.delete(snapshot.key);
    });
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

    return this;
  }
}

export default Lobbies;
