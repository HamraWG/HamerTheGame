'use strict';

import Phaser from 'phaser';
import CurrentPlayer from '../utils/CurrentPlayer';
import Player from '../utils/Player';
import Bullets from '../utils/Bullets';

export default class extends Phaser.State
{
  init (dbGame)
  {
    this.dbGame = dbGame;
  }

  shutdown ()
  {
    this.game.map = undefined;
    this.game.layers = undefined;
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

    this.bullets = new Bullets(this.game, this.dbGame.key);
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
    this.game.canvas.style.cursor = 'crosshair';

    this.players.forEach((player) =>
    {
      this.game.physics.arcade.collide(player.champion, this.game.layers.layer);

      player.champion.body.velocity.x = 0;
      player.champion.body.velocity.y = 0;

      if (player instanceof CurrentPlayer)
      {
        this.game.physics.arcade.collide(player.hitTestObject, this.game.layers.layer);

        player.hitTestObject.body.velocity.x = 0;
        player.hitTestObject.body.velocity.y = 0;
      }

      player.update();
    });

    this.bullets.map.forEach((bullet) =>
    {
      this.game.physics.arcade.collide(bullet, this.game.layers.layer, bullet.remove, () => true, bullet);

      bullet.update();
    });
  }

  render ()
  {}
}
