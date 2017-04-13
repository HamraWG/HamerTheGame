'use strict';

import Phaser from 'phaser';
import CurrentPlayer from '../utils/CurrentPlayer';
import Player from '../utils/Player';

export default class extends Phaser.State
{
  init (dbGame)
  {
    this.game.time.desireFps = 30;
    this.dbGame = dbGame;
  }

  create ()
  {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.map = this.game.add.tilemap(`map-${this.dbGame.map}`);
    this.game.map.addTilesetImage(`tiles-${this.dbGame.map}`);

    this.game.layers = {};
    this.game.layers.layer = this.game.map.createLayer('layer');
    this.game.layers.layer.resizeWorld();

    this.game.map.setCollisionBetween(2, 12);

    this.keyboard = this.game.input.keyboard;
    this.players = new Set();
    this.createPlayers();
  }

  createPlayers ()
  {
    for (let playerKey in this.dbGame.players)
    {
      let player = playerKey === this.game.currentUser.key ? new CurrentPlayer(this.game, this.dbGame.getPlayerRef(playerKey)) : new Player(this.game, this.dbGame.getPlayerRef(playerKey));
      this.players.add(player);
    }
  }

  update ()
  {
    this.players.forEach((player) =>
    {
      this.game.physics.arcade.collide(player, this.game.layers.layer);

      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      if (this.keyboard.addKey(Phaser.Keyboard.W).isDown)
      {
        player.body.velocity.y = -300;
      }
      if (this.keyboard.addKey(Phaser.Keyboard.S).isDown)
      {
        player.body.velocity.y = 300;
      }
      if (this.keyboard.addKey(Phaser.Keyboard.A).isDown)
      {
        player.body.velocity.x = -300;
      }
      if (this.keyboard.addKey(Phaser.Keyboard.D).isDown)
      {
        player.body.velocity.x = 300;
      }
    });

    /*
    console.log(this.player);
    let line = new Phaser.Line(this.player.body.x, this.player.body.y, this.player.body.x, this.player.body.y - 10);

    let a = this.layers.walls.getRayCastTiles(line, 0);
    console.log(a);


    if (this.keyboard.addKey(Phaser.Keyboard.W).isDown)
    {
      console.log(this.game.physics.p2.hitTest(new Phaser.Point(this.player.body.x, this.player.body.y - 10))[0].parent);
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
    */
  }
}
