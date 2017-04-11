'use strict';

import {database} from '../utils';

/**
 * Class representing Player.
 */
class Player
{
  /**
   * Creates Player instance.
   */
  constructor ()
  {
    this._dbRef = database;

    this._key = this._dbRef.key;
    this._name = this._dbRef.name;
    this._hp = this._dbRef.hp;
    this._position = {
      x: this._dbRef.position.x || null,
      y: this._dbRef.position.y || null
    };
    this._alive = this._dbRef.alive;
    this._eq = this._dbRef.eq;

    this._update();
  }

  /**
   * Listens changes in database.
   */
  _update ()
  {
    this._dbRef.on('value', (snapshot) =>
    {
      if (snapshot.exists() === false) return;

      let data = snapshot.val();

      this._alive = data.alive;
      this._position = data.position;
      this._hp = data.hp;
      this._eq = data.eq;
    });
  }

  /**
   * Sets player's position
   *
   * @param {number} x Player's position relative to the vertical axis
   * @param {number} y Player's position relative to the horizontal axis
   * @returns {Player}
   */
  setPosition (x, y)
  {
    if (typeof x !== 'number') throw new TypeError('`x` must be a number!');
    if (typeof x !== 'number') throw new TypeError('`y` must be a number!');

    this._dbRef.update({
      position: {
        x: x,
        y: y
      }
    });

    return this;
  }

  /**
   * Returns player's position.
   *
   * @returns {{x: (number|null), y: (number|null)}}
   */
  getPosition ()
  {
    return {
      x: this._position.x,
      y: this._position.y
    };
  }
}

export default Player;
