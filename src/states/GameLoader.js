'use strict';

import Phaser from 'phaser';
import Game from '../utils/Game';

export default class extends Phaser.State
{
  init (gameKey)
  {
    this.dbGame = new Game(gameKey);

    localStorage.setItem('firebase:game:id', gameKey);
  }

  preload ()
  {
    this.game.load.spritesheet('champ:kamil', 'assets/champions/kamil.png', 32, 64);
    this.game.load.image('champ:kamil:hand', 'assets/champions/kamil-hand.png', 6, 16);
    this.game.load.spritesheet('champ:ninja', 'assets/champions/ninja.png', 32, 64);
    this.game.load.image('champ:ninja:hand', 'assets/champions/ninja-hand.png', 6, 16);
    this.game.load.spritesheet('champ:rambo', 'assets/champions/rambo.png', 32, 64);
    this.game.load.image('champ:rambo:hand', 'assets/champions/rambo-hand.png', 6, 16);
    this.game.load.spritesheet('weapons', 'assets/champions/weapons.png', 32, 32);
    this.game.load.image('bullet', 'assets/bullet.png');
    this.game.load.spritesheet('respawn-button', 'assets/images/respawn-button.png', 240, 60);
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

  update ()
  {
    if (this.game.load.isLoading === false && this.dbGame.name !== null)
    {
      this.state.start('MapLoader', true, false, this.dbGame);
    }
  }
}
