'use strict';

import Player from './Player';
import Weapon from './Weapon';
import Phaser from 'phaser';
import config from '../config';

class CurrentPlayer extends Player
{
  constructor (game, dbRef)
  {
    super(game, dbRef);

    // Database update helpers.
    this.updateTime = true;
    this.updateIteration = 1;
    this.updateEveryFrame = 5;

    this.game.camera.follow(this.champion);
    this.createHitTestObject();

    this.weapon = new Weapon(this.weaponSprite, dbRef.parent.parent.child('bullets'));

    this.moveTestToPlayerAtStart();
    this.addMovementKeyListeners();
  }

  createHitTestObject ()
  {
    this.hitTestObject = new Phaser.Sprite(this.game, this.champion.x, this.champion.y, 'champ:one', 0);
    this.game.physics.enable(this.hitTestObject);
    this.hitTestObject.body.collideWorldBounds = true;
    this.hitTestObject.alpha = 0;
    this.add(this.hitTestObject);
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
    if (direction !== 'up' && direction !== 'right' && direction !== 'down' && direction !== 'left')
    {
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

  updatePositionRelativeToTest ()
  {
    let updatePos = {};

    if (this.champion.body.x !== this.hitTestObject.body.x) updatePos.x = this.hitTestObject.body.x;
    if (this.champion.body.y !== this.hitTestObject.body.y) updatePos.y = this.hitTestObject.body.y;

    this._dbRef.child('position').update(updatePos);
  }

  moveTestToPlayerAtStart ()
  {
    if (this.champion.visible === false)
    {
      this.eventEmitter.once('value', () => this.moveTestToPlayer());
      return;
    }

    this.moveTestToPlayer();
  }

  moveTestToPlayer ()
  {
    this.hitTestObject.x = this.champion.x;
    this.hitTestObject.y = this.champion.y;
  }

  update ()
  {
    super.update();

    /**
     * Update iteration.
     * It blocks update database position every frame.
     */
    this.updateIteration++;
    if (this.updateIteration > this.updateEveryFrame) this.updateIteration = 0;
    this.updateTime = this.updateIteration === this.updateEveryFrame;

    let playerPos = this.getPosition();
    if ((this.hitTestObject.body.x !== playerPos.x || this.hitTestObject.body.y !== playerPos.y) && this.updateTime === true)
    {
      this.updatePositionRelativeToTest();
    }
  }
}

export default CurrentPlayer;
