'use strict';

import Lobby from './Lobby';
import {database} from '../utils';

/**
 * Class representing Lobbies.
 */
class Lobbies
{
  /**
   * Creates Lobbies instance.
   */
  constructor ()
  {
    this._dbRef = database.ref('lobbies');
    this._lobbies = new Map();
    this._eventsStorage = {};

    this._addEventsListeners();
  }

  /**
   * Creates new Lobby instance.
   *
   * @param {string} name Lobby's name.
   * @param {User} owner User instance.
   * @returns {Lobbies}
   */
  createLobby (name, owner)
  {
    if (typeof name !== 'string') throw new TypeError('name must be a non-empty string');

    let maps = [
      'pixel_dust',
      'pixel_cache'
    ];

    let mapIndex = Math.floor(Math.random() * maps.length);

    let lobby = this._dbRef.push({
      name: name,
      owner: owner.key,

      gameType: 'deathmatch',
      map: maps[mapIndex]
    });

    this._lobbies.set(lobby.key, new Lobby(lobby));

    return lobby;
  }

  /**
   * Gets Lobby instance.
   *
   * @param {string} key Lobby's key.
   * @returns {Lobby|undefined}
   */
  get (key)
  {
    return this._lobbies.get(key);
  }

  /**
   * .forEach invoked on Map of lobbies (Lobby.key, Lobby).
   *
   * @param {Function} callback
   * @return void
   */
  forEach (callback)
  {
    this._lobbies.forEach((value, key, map) => callback);
  }

  /**
   * Executes all events listeners.
   *
   * @private
   */
  _addEventsListeners ()
  {
    this._onNewLobby();
    this._onRemoveLobby();
  }

  /**
   * Adds new lobby to _lobbies and executes 'create' event.
   *
   * @private
   */
  _onNewLobby ()
  {
    this._dbRef.on('child_added', (snapshot) =>
    {
      let lobby = new Lobby(snapshot.ref);
      this._lobbies.set(snapshot.key, lobby);

      if (this._eventsStorage['create']) this._eventsStorage['create'].forEach((event) => event(lobby));
    });
  }

  /**
   * Executes 'remove' event and removes lobby from _lobbies.
   *
   * @private
   */
  _onRemoveLobby ()
  {
    this._dbRef.on('child_removed', (snapshot) =>
    {
      if (this._eventsStorage['remove']) this._eventsStorage['remove'].forEach((event) => event(this._lobbies.get(snapshot.key)));

      this._lobbies.delete(snapshot.key);
    });
  }

  /**
   * Adds new event listener.
   *
   * @param {string} type Event's type.
   * @param {function} callback Function that executes on event.
   * @returns {Lobbies}
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
   * @returns {Lobbies}
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
}

export default Lobbies;
