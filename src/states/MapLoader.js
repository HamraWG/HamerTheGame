'use strict';

import Phaser from 'phaser';

export default class extends Phaser.State
{
  init (dbGame)
  {
    this.dbGame = dbGame;
  }

  preload ()
  {
    console.log(this);
    this.game.load.tilemap(`map-${this.dbGame.map}`, `assets/maps/${this.dbGame.map}/map.json`, null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image(`tiles-${this.dbGame.map}`, `assets/maps/${this.dbGame.map}/tiles.png`);

    // Loading info
    let loadingText = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Wczytywanie tajemniczych danych...',
      {
        font: '16px Arial',
        fill: '#fff',
        align: 'center'
      }
    );
    loadingText.anchor.setTo(0.5, 0.5);
  }

  render ()
  {
    if (this.game.load.isLoading === false && this.dbGame.name !== null)
    {
      this.state.start('Game', true, false, this.dbGame);
    }
  }
}
