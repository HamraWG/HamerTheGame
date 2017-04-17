'use strict';

import {database} from '../utils';
import EventEmitter from 'wolfy87-eventemitter';

class Game extends EventEmitter
{
  constructor (key)
  {
    super();

    this._dbRef = database.ref(`games/${key}`);

    this._key = null;
    this._name = null;
    this._map = null;
    this._gameType = null;
    this._players = null;
    this._bullets = null;

    this.listenData();
  }

  listenData ()
  {
    this._dbRef.on('value', (snapshot) =>
    {
      let data = snapshot.val();
      console.log(data);
      this._key = snapshot.key;
      this._name = data.name;
      this._map = data.map;
      this._gameType = data.gameType;
      this._players = data.players;
      this._bullets = data.bullets;

      this.emitEvent('value');
    });
  }

  getPlayerRef (key)
  {
    if (typeof key !== 'string' || !key) throw new TypeError('`key` must be a non-empty string');

    return this._dbRef.child(`players/${key}`);
  }

  get key ()
  {
    return this._key;
  }

  get name ()
  {
    return this._name;
  }

  get map ()
  {
    return this._map;
  }

  get gameType ()
  {
    return this._gameType;
  }

  get players ()
  {
    return this._players;
  }

  get bullets ()
  {
    return this._bullets;
  }
}

export default Game;
