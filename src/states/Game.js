'use strict';

import Phaser from 'phaser';

export default class extends Phaser.State
{
  init (dbGame)
  {
    this.game.time.desireFps = 30;
    this.dbGame = dbGame;
  }

  create ()
  {
    this.game.physics.startSystem(Phaser.Physics.P2JS);

    this.map = this.game.add.tilemap(`map-${this.dbGame.map}`);
    this.map.addTilesetImage(`tiles-${this.dbGame.map}`);

    this.layers = {};
    this.layers.walls = this.map.createLayer('walls');
    this.layers.walls.resizeWorld();

    this.map.setCollision(1, 12);
    this.game.physics.p2.convertTilemap(this.map, this.layers.walls);

    this.player = this.game.add.sprite(0, 0, 'champ:one', 0);
    this.game.physics.p2.enable(this.player);
    this.player.body.fixedRotation = true;
    this.game.camera.follow(this.player);

    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.keyboard = this.game.input.keyboard;
  }

  update ()
  {
    this.player.body.setZeroVelocity();

    if (this.keyboard.addKey(Phaser.Keyboard.W).isDown)
    {
      this.player.body.moveUp(300);
    }
    if (this.keyboard.addKey(Phaser.Keyboard.S).isDown)
    {
      this.player.body.moveDown(300);
    }
    if (this.keyboard.addKey(Phaser.Keyboard.A).isDown)
    {
      this.player.body.moveLeft(300);
    }
    if (this.keyboard.addKey(Phaser.Keyboard.D).isDown)
    {
      this.player.body.moveRight(300);
    }
  }
}
