'use strict';

class Game
{
  constructor (dbRef)
  {
    this._dbRef = dbRef;

    this._name = this._dbRef.name;
    this._map = this._dbRef.map;
    this._gameType = this._dbRef.gameType;
    this._players = this._dbRef.players;
  }
}

export default Game;
