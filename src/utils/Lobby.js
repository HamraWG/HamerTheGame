'use strict';

/**
 * Class representing a Lobby.
 */
class Lobby
{
  /**
   * Creates lobby instance.
   *
   * @param {firebase.Database} dbRef The firebase database
   */
  constructor (dbRef)
  {
    this._dbRef = dbRef;
    this._eventsStorage = {};

    this._key = this._dbRef.key;
    this._name = this._dbRef.name;
    this._owner = this._dbRef.owner;
    this._players = this._dbRef.players;

    this._addEventsListeners();
  }

  /**
   * Gets lobby's key.
   *
   * @returns {string}
   */
  get key ()
  {
    return this._key;
  }

  /**
   * Gets lobby's name.
   *
   * @returns {string}
   */
  get name ()
  {
    return this._name;
  }

  /**
   * Sets lobby's name.
   *
   * @param {string} name Lobby's name.
   */
  set name (name)
  {
    if (typeof name !== 'string' || !name) throw new TypeError('name must be a non-empty string');

    this._name = name;
    this._dbRef.set({name: name});
  }

  /**
   * Gets lobby's owner key.
   *
   * @returns {string}
   */
  get owner ()
  {
    return this._owner;
  }

  /**
   * Sets lobby's owner.
   *
   * @param {string} ownerKey User's key.
   */
  set owner (ownerKey)
  {
    if (typeof ownerKey !== 'string' || !ownerKey) throw new TypeError('ownerKey must be a non-empty string.');

    this._owner = ownerKey;
    this._dbRef.set({owner: ownerKey});
  }

  /**
   * Gets players in lobby.
   *
   * @readonly
   * @returns {array}
   */
  get players ()
  {
    return this._players;
  }

  /**
   * Executes all events listeners.
   *
   * @private
   */
  _addEventsListeners ()
  {
    this._onChange();
  }

  /**
   * Replaces all lobby variables and executes 'change' event.
   *
   * @private
   */
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

  /**
   * Adds player to the lobby.
   *
   * @param {User} player User instance.
   * @returns {Lobby}
   */
  addPlayer (player)
  {
    this._players[player.key] = player.name;
    this._dbRef.child('players').update({[player.key]: player.name});

    return this;
  }

  /**
   * Removes player from lobby if he leaves.
   *
   * @param {User} player User instance.
   * @returns {Lobby}
   */
  removePlayerOnDisconnect (player)
  {
    this._dbRef.child(`players/${player.key}`).onDisconnect().remove();

    return this;
  }

  /**
   * Removes player from lobby.
   *
   * @param {User} player User instance.
   * @returns {Lobby}
   */
  removePlayer (player)
  {
    this._dbRef.child(`players/${player.key}`).remove();

    return this;
  }

  /**
   * Adds new event listener.
   *
   * @param {string} type Event's type.
   * @param {function} callback Function that executes on event.
   * @returns {Lobby}
   */
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

  /**
   * Removes event listener.
   *
   * @param {string} type Event's type.
   * @param {function} callback Function that will be remove.
   * @returns {Lobby}
   */
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

  /**
   * Removes all events listeners.
   *
   * @returns {Lobby}
   */
  offAllListeners ()
  {
    this._eventsStorage = {};

    return this;
  }
}

export default Lobby;
