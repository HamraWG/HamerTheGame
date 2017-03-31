import Phaser from 'phaser';
import config from './../config';

import Lobbies from './../utils/Lobbies';

export default class extends Phaser.State
{
  init ()
  {
    this.lobbyUI = null;
    this.lobbies = new Lobbies(this.game.database);
  }

  create ()
  {
    this.game.add.image(60, 11, 'm-logo');

    this.createLobbyUI();
  }

  createLobbyUI ()
  {
    this.lobbyUI = document.createElement('div');
    this.lobbyUI.id = 'lobby-ui';
    this.lobbyUI.style.left = `60px`;
    this.lobbyUI.style.top = `60px`;
    this.lobbyUI.style.width = `${config.gameWidth - 120}px`;
    this.lobbyUI.style.height = `${config.gameHeight - 80}px`;

    this.lobbyUI.appendChild(this.createLobbiesBox());
    this.lobbyUI.appendChild(this.createLobbyForm());
    document.querySelector('#game').appendChild(this.lobbyUI);
  }

  createLobbyForm ()
  {
    let form = document.createElement('form');
    form.id = 'create-lobby-form';
    form.classList.add('lobby-form');

    form.appendChild(this._createLobbyFormHeader());
    form.appendChild(this._createLobbyFormNameField());
    form.appendChild(this._createLobbyFormSubmit());

    form.addEventListener('submit', (evt) => this.createLobby(evt));

    return form;
  }

  _createLobbyFormHeader ()
  {
    let header = document.createElement('h2');
    header.classList.add('header');
    header.innerHTML = 'Stwórz lobby';

    return header;
  }

  _createLobbyFormNameField ()
  {
    let nameField = document.createElement('input');
    nameField.setAttribute('type', 'text');
    nameField.id = 'lobby-name-field';
    nameField.setAttribute('placeholder', 'Nazwa dla twojego lobby');
    nameField.setAttribute('maxlength', '32');
    nameField.classList.add('lobby-name-field');

    return nameField;
  }

  _createLobbyFormSubmit ()
  {
    let submit = document.createElement('button');
    submit.innerHTML = 'Stwórz';

    return submit;
  }

  createErrorField (text)
  {
    if (document.querySelector('#create-lobby-form #error-field'))
    {
      document.querySelector('#create-lobby-form #error-field').innerHTML = text;
      return;
    }

    let errorField = document.createElement('p');
    errorField.id = 'error-field';
    errorField.classList.add('error-field');
    errorField.innerHTML = text;

    document.querySelector('#create-lobby-form').appendChild(errorField);
  }

  createLobbiesBox ()
  {
    let lobbiesBox = document.createElement('div');
    lobbiesBox.classList.add('lobbies-box');

    let lobbiesHeader = document.createElement('h2');
    lobbiesHeader.classList.add('header');
    lobbiesHeader.innerHTML = 'Dołącz do rozgrywki';

    lobbiesBox.appendChild(lobbiesHeader);
    lobbiesBox.appendChild(this.createLobbiesList());

    return lobbiesBox;
  }

  createLobbiesList ()
  {
    let lobbiesList = document.createElement('ul');
    lobbiesList.classList.add('lobbies');

    this.lobbies.on('create', (lobby) =>
    {
      lobbiesList.appendChild(this._createLobbyElement(lobby));
    });

    this.lobbies.on('remove', (lobby) =>
    {
      // TODO(Ivan): Add animation for removing lobby
      let lobbyElement = lobbiesList.querySelector(`#lobby-${lobby.key}`);
      lobbiesList.removeChild(lobbyElement);
    });

    return lobbiesList;
  }

  _createLobbyElement (lobby)
  {
    let lobbyElement = document.createElement('li');
    lobbyElement.id = `lobby-${lobby.key}`;
    lobbyElement.classList.add('lobbies__item', 'lobby');

    lobbyElement.appendChild(this._createLobbyName(lobby.name));
    lobbyElement.appendChild(this._createLobbyPlayers(lobby.players, lobby.owner));
    return lobbyElement;
  }

  _createLobbyName (name)
  {
    if (typeof name !== 'string') throw new TypeError('name must be a non-empty string');

    let lobbyName = document.createElement('h3');
    lobbyName.classList.add('lobby__name');
    lobbyName.innerHTML = name;

    return lobbyName;
  }

  _createLobbyPlayers (players, owner)
  {
    if (typeof players !== 'object') throw new TypeError('players must be an object');

    let lobbyPlayers = document.createElement('p');
    lobbyPlayers.classList.add('lobby__players');

    for (let key in players)
    {
      let player = document.createElement('span');
      player.innerHTML = players[key];
      player.classList.add('lobby__player');
      if (key === owner) player.classList.add('lobby__player--owner');

      if (lobbyPlayers.childElementCount !== 0) lobbyPlayers.innerHTML += ', ';
      lobbyPlayers.appendChild(player);
    }

    return lobbyPlayers;
  }

  createLobby (evt)
  {
    evt.preventDefault();

    let lobbyName = document.querySelector('#lobby-name-field').value;
    if (lobbyName.length < 3 || lobbyName.length > 32)
    {
      this.createErrorField('Wprowadź nazwę dla niesamowitego lobby!');
      return false;
    }

    this.lobbies.createLobby(lobbyName, this.game.currentUser);
  }
}
