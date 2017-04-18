'use strict';

import Phaser from 'phaser';
import Game from '../utils/Game';

export default class extends Phaser.State
{
  init (gameKey)
  {
    this.dbGame = new Game(gameKey);

    if (this.dbGame.name) this.loadMapInit(this);
    else this.dbGame.once('value', () => this.loadMapInit(this));

    this.allLoaded = false;

    localStorage.setItem('firebase:game:id', gameKey);
  }

  preload ()
  {
    this.game.load.spritesheet('champ:kamil', 'assets/champions/kamil.png', 32, 64);
    this.game.load.spritesheet('champ:kamil:hand', 'assets/champions/kamil-hand.png', 6, 16);
    this.game.load.spritesheet('champ:ninja', 'assets/champions/ninja.png', 32, 64);
    this.game.load.spritesheet('champ:ninja:hand', 'assets/champions/ninja-hand.png', 6, 16);
    this.game.load.spritesheet('weapons', 'assets/champions/weapons.png', 32, 32);
    this.game.load.spritesheet('respawn-button', 'assets/images/respawn-button.png', 240, 60);
    this.game.load.image('bullet', 'assets/bullet.png');
    this.game.load.spritesheet('menu-button', 'assets/images/menu-button.png', 200, 50);

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
