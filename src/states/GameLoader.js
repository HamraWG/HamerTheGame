'use strict';

import Phaser from 'phaser';
import Game from '../utils/Game';

export default class extends Phaser.State
{
  init (gameKey)
  {
    this.dbGame = new Game(gameKey);
    // TODO(Ivan): Refactor it!
    if (this.dbGame.name) this.loadMapInit(this);
    else this.dbGame.once('value', () => this.loadMapInit(this));

    // TODO(Ivan): Start game when all players all loaded
    this.allLoaded = false;
  }

  preload ()
  {
    this.game.load.spritesheet('champ:one', 'assets/champions/one.png', 32, 64);

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

  loadMapInit ()
  {
    let loader = this.game.load;
    loader.tilemap(`map-${this.dbGame.map}`, `assets/maps/${this.dbGame.map}/map.json`, null, Phaser.Tilemap.TILED_JSON);
    loader.image(`tiles-${this.dbGame.map}`, `assets/maps/${this.dbGame.map}/tiles.png`);
    loader.start();

    loader.onLoadComplete.add(() =>
    {
      this.state.start('Game', true, false, this.dbGame);
    });
  }
}
