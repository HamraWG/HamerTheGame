'use strict';

import 'pixi';
import 'p2';
import Phaser from 'phaser';
import firebase from 'firebase';

import BootState from './states/Boot';
import MenuState from './states/Menu';
import LobbiesState from './states/Lobbies';
import LobbyState from './states/Lobby';
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
    this.state.add('Game', GameState, false);

    this.firebase = firebase.initializeApp(config.firebase);
    this.database = this.firebase.database();
    this.currentUser = new User(this.database);

    this.state.start('Boot');
  }
}

new Game();
