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
    super(game, 0, 0, 'champ:one', 0);
    this._dbRef = dbRef;
    this.eventEmitter = new EventEmitter();

    this.visible = false;
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.velocity = 300;

    this.game.add.existing(this);

    this._addAnimations();
    this.eventEmitter.once('value', () => this.instantPositionUpdate(this));
    this._listenChange();
  }

  /**
   * Listens changes in database.
   */
  _listenChange ()
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

  instantPositionUpdate ()
  {
    this.x = this._position.x;
    this.y = this._position.y;
    this.visible = true;
  }

  /**
   * Returns player's position.
   *
   * @returns {object}
   */
  getPosition ()
  {
    return this._position;
  }

  update ()
  {
    let posPlayer = this.getPosition();
    if (this.body.x !== posPlayer.x)
    {
      this.body.velocity.x = posPlayer.x > this.body.x ? this.velocity : -this.velocity;
    }
    if (this.body.y !== posPlayer.y)
    {
      this.body.velocity.y = posPlayer.y > this.body.y ? this.velocity : -this.velocity;
    }
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
