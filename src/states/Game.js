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
    let map = this.game.add.tilemap(`map-${this.dbGame.map}`);
    map.addTilesetImage(`tiles-${this.dbGame.map}`);

    let ground = map.createLayer('ground');
    ground.resizeWorld();
    let walls = map.createLayer('walls');
    walls.resizeWorld();

    this.createPlayers();
  }

  createPlayers ()
  {
    for (let player in this.dbGame.players)
    {
      let p = new Player(this.game, this.dbGame.getPlayerRef(player));
      this.game.add.existing(p);

      p.eventEmitter.on('value', () =>
      {
        p.x = p._position.x;
        p.y = p._position.y;
      });
    }
  }

  update ()
  {

  }
}
