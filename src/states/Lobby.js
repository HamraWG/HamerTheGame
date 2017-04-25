'use strict';

import Phaser from 'phaser';
import {escapeSpecialChars} from './../utils';
import config from './../config';

import CreateGameListener from './../utils/CreateGameListener';
import GameCreator from './../utils/GameCreator';

export default class extends Phaser.State
{
  init (lobby)
  {
    this.lobby = lobby;
    this.lobby.offAllListeners();
    this.lobby.addPlayer(this.game.currentUser);
    this.lobby.removePlayerOnDisconnect(this.game.currentUser);

    this.createGameListener = new CreateGameListener(this.lobby.key);
    this.isOwner = false;
  }

  preload ()
  {
    this.load.spritesheet('avatars', 'assets/champions/avatars.png');
  }

  create ()
  {
    this.game.add.image(60, 11, 'm-logo');
    this.createBackToLobbiesButton();
    this.createLobbyUI();
    this.isUserAnOwner(this.lobby.owner);
  }

  shutdown ()
  {
    this.lobbyUI.remove();
    document.querySelector('#game').classList.remove('lobby-owner');
    document.querySelector('.back-button').remove();
  }

  render ()
  {
    if (this.createGameListener.created === true)
    {
      this.joinGame();
    }
  }

  joinGame ()
  {
    this.lobby.removePlayer(this.game.currentUser);
    this.state.start('GameLoader', true, false, this.lobby.key);
  }

  goToLobbies ()
  {
    this.lobby.removePlayer(this.game.currentUser);
    this.state.start('Lobbies');
  }

  createBackToLobbiesButton ()
  {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('back-button');
    button.innerHTML = 'Wróć do listy';

    button.style.position = 'absolute';
    button.style.right = '60px';
    button.style.top = '10px';

    button.addEventListener('click', () => this.goToLobbies());

    document.querySelector('#game').appendChild(button);
  }

  isUserAnOwner (owner)
  {
    if (this.game.currentUser.key === owner)
    {
      this.isOwner = true;
      this.gameCreator = new GameCreator();

      if (!document.querySelector('#lobby-ui .owner-box'))
      {
        let manageBox = this.lobbyUI.querySelector('.management-box');
        if (manageBox.childElementCount > 0) manageBox.insertBefore(this.createOwnerBox(), manageBox.firstChild);
        else manageBox.appendChild(this.createOwnerBox());
      }
    }
    else
    {
      this.isOwner = false;
    }
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
    this.lobbyUI.appendChild(this.createManagementBox());
    this.isUserAnOwner(this.lobby.owner);

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
    if (!lobbyPlayerBox) return;

    let lobbyName = lobbyPlayerBox.querySelector('.lobby__name');
    lobbyName.innerHTML = escapeSpecialChars(data.name);

    let lobbyPlayers = lobbyPlayerBox.querySelector('.lobby__players');
    while (lobbyPlayers.hasChildNodes()) lobbyPlayers.removeChild(lobbyPlayers.lastChild);
    let playersItems = this.createPlayersItems(data.players, data.owner);
    playersItems.forEach((item) => lobbyPlayers.appendChild(item));
  }

  _createLobbyName ()
  {
    let lobbyName = document.createElement('h2');
    lobbyName.classList.add('header', 'lobby__name');
    lobbyName.innerHTML = escapeSpecialChars(this.lobby.name);

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
      player.innerHTML = escapeSpecialChars(players[key].name);
      player.classList.add('lobby__player');
      if (key === owner) player.classList.add('lobby__player--owner');

      playersSet.add(player);
    }

    return playersSet;
  }

  createManagementBox ()
  {
    let managementBox = document.createElement('div');
    managementBox.classList.add('management-box');

    managementBox.appendChild(this._createChampionForm());

    return managementBox;
  }

  _createChampionForm ()
  {
    let champForm = document.createElement('form');
    champForm.classList.add('lobby-form', 'champion-form');

    champForm.appendChild(this._createChampionInput('random'));
    champForm.appendChild(this._createChampionInput('kamil'));
    champForm.appendChild(this._createChampionInput('ninja'));
    champForm.appendChild(this._createChampionInput('rambo'));

    return champForm;
  }

  _createChampionInput (champion)
  {
    let label = document.createElement('label');

    let input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'champion');
    input.setAttribute('value', champion);
    input.id = `champion-${champion}`;

    label.appendChild(input);

    label.addEventListener('click', (evt) =>
    {
      this._onChampionCheckInput(evt, this.lobby);
    });

    return label;
  }

  _onChampionCheckInput (evt, lobby)
  {
    let label = evt.currentTarget;

    if (label.classList.contains('checked')) return;

    label.closest('form').querySelectorAll('label').forEach((l) =>
    {
      l.classList.remove('checked');
    });

    label.classList.add('checked');

    lobby.setPlayerChampion(this.game.currentUser.key, label.querySelector('input').value);
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
    ownerForm.appendChild(this._createStartGameButton());

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

  _createStartGameButton ()
  {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.innerHTML = 'Rozpocznij grę';

    button.addEventListener('click', () => this.createGame());

    return button;
  }

  createGame ()
  {
    this.gameCreator.create(this.lobby.key, this.lobby.name, this.lobby.players, this.lobby.map, this.lobby.gameType);
  }
}
