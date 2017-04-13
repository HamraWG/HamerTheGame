'use strict';

import Player from './Player';
import Phaser from 'phaser';
import config from '../config';

class CurrentPlayer extends Player
{
  constructor (game, dbRef)
  {
    super(game, dbRef);

    this.game.camera.follow(this);

    this.hitTestObject = new Phaser.Sprite(game, this.body.x, this.body.y, 'champ:one', 0);
    this.game.physics.enable(this.hitTestObject);
    this.hitTestObject.body.collideWorldBounds = true;
    this.hitTestObject.alpha = 0;
    this.game.add.existing(this.hitTestObject);

    this.moveTestToPlayerAtStart();
    this.addMovementKeyListeners();
  }

  addMovementKeyListeners ()
  {
    let keyboard = this.game.input.keyboard;

    keyboard.addKey(config.controls.up).onHoldCallback = () => this.move('up');
    keyboard.addKey(config.controls.right).onHoldCallback = () => this.move('right');
    keyboard.addKey(config.controls.down).onHoldCallback = () => this.move('down');
    keyboard.addKey(config.controls.left).onHoldCallback = () => this.move('left');
  }

  move (direction)
  {
    if (direction !== 'up' && direction !== 'right' && direction !== 'down' && direction !== 'left') {
      throw new TypeError('`direction` must be a string equals `up`, `right`, `down` or `left`');
    }

    switch (direction)
    {
      case 'up':
        this.hitTestObject.body.velocity.y = -this.velocity;
        break;

      case 'right':
        this.hitTestObject.body.velocity.x = this.velocity;
        break;

      case 'down':
        this.hitTestObject.body.velocity.y = this.velocity;
        break;

      case 'left':
        this.hitTestObject.body.velocity.x = -this.velocity;
        break;
    }
  }

  collideTest ()
  {
    this.testCollides = false;
    this.game.physics.arcade.collide(this.hitTestObject, this.game.layers.layer, () =>
    {
      this.testCollides = true;
    });
  }

  updatePositionRelativeToTest ()
  {
    let updatePos = {};

    if (this.body.x !== this.hitTestObject.body.x) updatePos.x = this.hitTestObject.body.x;
    if (this.body.y !== this.hitTestObject.body.y) updatePos.y = this.hitTestObject.body.y;

    this._dbRef.child('position').update(updatePos);
    console.log('elo');
  }

  moveTestToPlayerAtStart ()
  {
    if (this.visible === false)
    {
      this.eventEmitter.once('value', () => this.moveTestToPlayer());
      return;
    }

    this.moveTestToPlayer();
  }

  moveTestToPlayer ()
  {
    this.hitTestObject.x = this.x;
    this.hitTestObject.y = this.y;
  }

  update ()
  {
    super.update();

    let playerPos = this.getPosition();
    if (this.hitTestObject.body.x !== playerPos.x || this.hitTestObject.body.y !== playerPos.y)
    {
      this.updatePositionRelativeToTest();
    }
  }
}

export default CurrentPlayer;
