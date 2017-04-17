'use strict';

import Phaser from 'phaser';

class Bullet extends Phaser.Sprite
{
  constructor (game, x, y, size, angle, velocity, owner, power, ref)
  {
    super(game, x, y, 'bullet', 0);

    if (typeof game === 'undefined') throw new TypeError('`game` must be a Phaser.Game instance');
    if (typeof x !== 'number') throw new TypeError('`x` must be a number');
    if (typeof y !== 'number') throw new TypeError('`y` must be a number');
    if (typeof size !== 'number') throw new TypeError('`size` must be a number.');
    if (typeof angle !== 'number') throw new TypeError('`size` must be a number.');
    if (typeof velocity !== 'number') throw new TypeError('`velocity` must be a number.');
    if (typeof owner !== 'string') throw new TypeError('`owner` must be a string.');
    if (typeof power !== 'number') throw new TypeError('`power` must be a number.');
    if (typeof ref === 'undefined') throw new TypeError('`power` must be a firebase.Reference.');

    this.game = game;

    this.angle = angle;
    this.velocity = velocity;
    this.owner = owner;
    this.power = power;
    this._dbRef = ref;

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
  {
    this._dbRef.remove();
  }

  remove ()
  {
    if (this.owner === this.game.currentUser.key)
    {
      this._removeDBData();
    }

    this.destroy();

    return true;
  }
}

export default Bullet;