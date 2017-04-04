'use strict';

import Phaser from 'phaser';
import config from './../config';

export default class extends Phaser.State
{
  init (lobby)
  {
    this.lobby = lobby;

    this.lobby.addPlayer(this.game.currentUser);
    this.lobby.removePlayerOnDisconnect(this.game.currentUser);
  }

  create ()
  {
    this.createLobbyUI();
  }

  shutdown ()
  {
    this.lobbyUI.remove();
  }

  createLobbyUI ()
  {
    this.lobbyUI = document.createElement('div');
    this.lobbyUI.id = 'lobby-ui';
    this.lobbyUI.style.left = `60px`;
    this.lobbyUI.style.top = `60px`;
    this.lobbyUI.style.width = `${config.gameWidth - 120}px`;
    this.lobbyUI.style.height = `${config.gameHeight - 80}px`;

    document.querySelector('#game').appendChild(this.lobbyUI);
  }

  _createLobbyName ()
  {
    // let lobbyName = document.createElement('h2');
  }
}
