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

    this.isUserAnOwner = this.game.currentUser.key === this.lobby.owner;
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
    if (this.isUserAnOwner === true) this.lobbyUI.appendChild(this.createOwnerBox());
    document.querySelector('#game').appendChild(this.lobbyUI);
  }

  createPlayerBox ()
  {
    let lobbyPlayerBox = document.createElement('div');
    lobbyPlayerBox.classList.add('lobby');

    lobbyPlayerBox.appendChild(this._createLobbyName());
    lobbyPlayerBox.appendChild(this._createLobbyPlayersList());

    this.lobby.on('change', (data) => this.updateLobby(data));

    return lobbyPlayerBox;
  }

  updateLobby (data)
  {
    let lobbyPlayerBox = document.querySelector('.lobby');

    let lobbyName = lobbyPlayerBox.querySelector('.lobby__name');
    lobbyName.innerHTML = data.name;

    let lobbyPlayers = lobbyPlayerBox.querySelector('.lobby__players');
    while (lobbyPlayers.hasChildNodes()) lobbyPlayers.removeChild(lobbyPlayers.lastChild);
    let playersItems = this.createPlayersItems(data.players, data.owner);
    playersItems.forEach((item) => lobbyPlayers.appendChild(item));
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

  createOwnerBox ()
  {
    document.querySelector('#game').classList.add('lobby-owner');

    let ownerBox = document.createElement('div');
    ownerBox.classList.add('owner-box');
    ownerBox.appendChild(this._createOwnerForm());

    return ownerBox;
  }

  _createOwnerForm ()
  {
    let ownerForm = document.createElement('form');
    ownerForm.classList.add('lobby-form');

    ownerForm.appendChild(this._createOwnerFormNameInput());

    return ownerForm;
  }

  _createOwnerFormNameInput ()
  {
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.id = 'lobby-name-field';
    input.setAttribute('placeholder', 'Nazwa dla twojego lobby');
    input.setAttribute('maxlength', '32');
    input.classList.add('lobby-name-field');
    input.value = this.lobby.name;

    input.addEventListener('keyup', () =>
    {
      let newName = input.value;

      if (newName.length >= 3 && newName.length <= 32)
      {
        this.lobby.name = newName;
        input.classList.remove('error');
        return;
      }

      input.classList.add('error');
    });

    return input;
  }
}
