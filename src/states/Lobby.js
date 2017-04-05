'use strict';

import Phaser from 'phaser';
import config from './../config';

export default class extends Phaser.State
{
  init (lobby)
  {
    this.lobby = lobby;
    this.lobby.offAllListeners();
    this.lobby.addPlayer(this.game.currentUser);
    this.lobby.removePlayerOnDisconnect(this.game.currentUser);
  }

  create ()
  {
    this.game.add.image(60, 11, 'm-logo');
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

    this.lobbyUI.appendChild(this.createPlayerBox());
    document.querySelector('#game').appendChild(this.lobbyUI);
  }

  createPlayerBox ()
  {
    let lobbyPlayerBox = document.createElement('div');
    lobbyPlayerBox.classList.add('lobby');

    lobbyPlayerBox.appendChild(this._createLobbyName());
    lobbyPlayerBox.appendChild(this._createLobbyPlayersList());

    this.lobby.on('change', (data) =>
    {
      let lobbyName = lobbyPlayerBox.querySelector('.lobby__name');
      lobbyName.innerHTML = data.name;

      let lobbyPlayers = lobbyPlayerBox.querySelector('.lobby__players');
      while (lobbyPlayers.hasChildNodes()) lobbyPlayers.removeChild(lobbyPlayers.lastChild);
      let playersItems = this.createPlayersItems(data.players, data.owner);
      playersItems.forEach((item) => lobbyPlayers.appendChild(item));
    });

    return lobbyPlayerBox;
  }

  _createLobbyName ()
  {
    let lobbyName = document.createElement('h2');
    lobbyName.classList.add('header', 'lobby__name');
    lobbyName.innerHTML = this.lobby.name;

    return lobbyName;
  }

  _createLobbyPlayersList ()
  {
    let playersList = document.createElement('ul');
    playersList.classList.add('lobby__players');

    let playersItems = this.createPlayersItems(this.lobby.players, this.lobby.owner);
    playersItems.forEach((item) => playersList.appendChild(item));

    return playersList;
  }

  createPlayersItems (players, owner)
  {
    let playersSet = new Set();

    for (let key in players)
    {
      let player = document.createElement('li');
      player.innerHTML = players[key];
      player.classList.add('lobby__player');
      if (key === owner) player.classList.add('lobby__player--owner');

      playersSet.add(player);
    }

    return playersSet;
  }
}
