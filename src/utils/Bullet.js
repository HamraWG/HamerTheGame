'use strict';

import Phaser from 'phaser';

class Bullet extends Phaser.Sprite
{
  constructor (game, x, y, size, angle, velocity, owner, power)
  {
    super(game, x, y, 'bullet', 0);

    if (typeof game === 'undefined') throw new TypeError('`game` must be a Phaser.Game instance');
    if (typeof x === 'undefined') throw new TypeError('`x` must be a number');
    if (typeof y === 'undefined') throw new TypeError('`y` must be a number');
    if (typeof size === 'undefined') throw new TypeError('`size` must be a number.');
    if (typeof angle === 'undefined') throw new TypeError('`size` must be a number.');
    if (typeof velocity === 'undefined') throw new TypeError('`velocity` must be a number.');
    if (typeof owner === 'undefined') throw new TypeError('`owner` must be a string.');
    if (typeof power === 'undefined') throw new TypeError('`power` must be a number.');

    this.game = game;

    this.angle = angle;
    this.velocity = velocity;
    this.owner = owner;
    this.power = power;

    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    this.game.add.existing(this);
  }

  update ()
  {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    this.game.physics.arcade.velocityFromRotation(this.angle, this.velocity, this.body.velocity);
  }

  _removeDBData ()
  {}

  remove ()
  {
    if (this.owner === this.game.currentUser.key)
    {
      // remove
    }

    return true;
  }
}

export default Bullet;
