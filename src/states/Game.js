'use strict';

import Phaser from 'phaser';
import CurrentPlayer from '../utils/CurrentPlayer';
import Player from '../utils/Player';

export default class extends Phaser.State
{
  init (dbGame)
  {
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

      if (player instanceof CurrentPlayer)
      {
        player.collideTest();

        player.hitTestObject.body.velocity.x = 0;
        player.hitTestObject.body.velocity.y = 0;
      }

      player.body.velocity.x = 0;
      player.body.velocity.y = 0;

      player.update();
    });
  }

  render ()
  {
    this.players.forEach((player) =>
    {
      if (player instanceof CurrentPlayer === false) return;

      this.game.debug.body(player.hitTestObject);
    });
  }
}
