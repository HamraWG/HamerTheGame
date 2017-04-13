'use strict';

import Phaser from 'phaser';
import EventEmitter from 'wolfy87-eventemitter';

/**
 * Class representing Player.
 */
class Player extends Phaser.Sprite
{
  /**
   * Creates Player instance.
   *
   * @param {Phaser.Game} game
   * @param {firebase.Database} dbRef
   */
  constructor (game, dbRef)
  {
    super(game, 32, 32, 'champ:one', 0);
    this._dbRef = dbRef;
    this.eventEmitter = new EventEmitter();

    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.game.camera.follow(this);
    this.velocity = 300;

    this.game.add.existing(this);

    this._addAnimations();
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

      this._key = snapshot.key;
      this._name = data.name;
      this._hp = data.hp;
      this._alive = data.alive;
      this._position = data.position;
      this._stats = data.stats;
      this._eq = data.eq;

      this.eventEmitter.emitEvent('value', [this]);
    });
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

  _addAnimations ()
  {
    let animationSpeed = 10;

    this.animations.add('down', [0, 1, 2, 3], animationSpeed, true);
    this.animations.add('left', [4, 5, 6, 7], animationSpeed, true);
    this.animations.add('right', [8, 9, 10, 11], animationSpeed, true);
    this.animations.add('up', [12, 13, 14, 15], animationSpeed, true);
  }
}

export default Player;
