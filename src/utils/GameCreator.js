'use strict';

import {database} from '../utils';

/**
 * Class representing GameCreator.
 */
class GameCreator
{
  /**
   * Creates GameCreator instance.
   */
  constructor ()
  {
    this._db = database.ref('games');
  }

  /**
   * Creates new game in database.
   *
   * @param {string} id Game's id.
   * @param {string} name Game's name.
   * @param {object} players Game's players.
   * @param {string} map Game's map.
   * @param {string} gameType Game's type.
   */
  create (id, name, players, map, gameType)
  {
    if (typeof id !== 'string' || !id) throw new TypeError('`id` must be a non-empty string');
    if (typeof name !== 'string' || !name) throw new TypeError('`name` must be a non-empty string');
    if (typeof players !== 'object' || !players) throw new TypeError('`players` must be an non-empty object');
    if (typeof map !== 'string' || !map) throw new TypeError('`map` must be a non-empty string');
    if (typeof gameType !== 'string' || !gameType) throw new TypeError('`gameType` must be a non-empty string');

    const gameStartConfig = {
      name: name,
      map: map,
      gameType: gameType,
      players: this._createPlayersConfig(players)
    };

    this._db.update({
      [id]: gameStartConfig
    });
  }

  /**
   * Creates players' config for the game.
   *
   * @param {object} players Players' list.
   * @private
   * @returns {object}
   */
  _createPlayersConfig (players)
  {
    const playersConfig = {};
    for (let pKey in players)
    {
      if (players.hasOwnProperty(pKey) === false) continue;

      playersConfig[pKey] = {
        name: players[pKey],
        champion: 'one',
        online: true,
        alive: false,
        position: {
          x: Math.floor(Math.random() * 300) + 1,
          y: Math.floor(Math.random() * 200) + 1
        },
        stats: {
          kills: 0,
          deaths: 0,
          assists: 0
        },
        eq: {}
      };
    }

    return playersConfig;
  }
}

export default GameCreator;
