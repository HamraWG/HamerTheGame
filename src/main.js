import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import MenuState from './states/Menu';

import config from './config';

class Game extends Phaser.Game
{
  constructor ()
  {
    super(config.gameWidth, config.gameHeight, Phaser.WEBGL, 'game', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Menu', MenuState, false);

    this.state.start('Boot');
  }
}

window.game = new Game();
