'use strict';

import 'pixi';
import 'p2';
import Phaser from 'phaser';
import firebase from 'firebase';

import BootState from './states/Boot';
import MenuState from './states/Menu';
import LobbiesListState from './states/LobbiesList';

import User from './utils/User.js';

import config from './config';

class Game extends Phaser.Game
{
  constructor ()
  {
    super(config.gameWidth, config.gameHeight, Phaser.WEBGL, 'game', null);

    this.state.add('Boot', BootState, false);
    this.state.add('Menu', MenuState, false);
    this.state.add('LobbiesList', LobbiesListState, false);

    this.firebase = firebase.initializeApp(config.firebase);
    this.database = this.firebase.database();
    this.currentUser = new User(this.database);

    this.state.start('Boot');
  }
}

window.game = new Game();
