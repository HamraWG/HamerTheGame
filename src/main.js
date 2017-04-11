'use strict';

import 'pixi';
import 'p2';
import Phaser from 'phaser';

import BootState from './states/Boot';
import MenuState from './states/Menu';
import LobbiesState from './states/Lobbies';
import LobbyState from './states/Lobby';
import GameLoaderState from './states/GameLoader';
import GameState from './states/Game';

import User from './utils/User.js';

import config from './config';

class Game extends Phaser.Game
{
  constructor ()
  {
    super(config.gameWidth, config.gameHeight, Phaser.WEBGL, 'game', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Menu', MenuState, false);
    this.state.add('Lobbies', LobbiesState, false);
    this.state.add('Lobby', LobbyState, false);
    this.state.add('GameLoader', GameLoaderState, false);
    this.state.add('Game', GameState, false);

    this.currentUser = new User();

    this.state.start('Boot');
  }
}

new Game();
