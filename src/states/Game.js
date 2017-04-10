'use strict';

import Phaser from 'phaser';

export default class extends Phaser.State
{
  init ()
  {
    //
  }

  preload ()
  {
    this.game.load.tilemap('map', 'assets/maps/Elo.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/maps/tiles.png');
  }

  create ()
  {
    let map = this.game.add.tilemap('map');
    map.addTilesetImage('tiles');

    let layer = map.createLayer(0);
    layer.resizeWorld();
  }

  render ()
  {}
}
