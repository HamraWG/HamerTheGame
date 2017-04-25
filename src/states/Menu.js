'use strict';

import Phaser from 'phaser';

export default class extends Phaser.State
{
  init ()
  {
    this.nameField = null;
    this.fieldError = null;

    this.stage.backgroundColor = '#1d1b19';
  }

  create ()
  {
    let logo = this.game.add.image(
      this.game.world.centerX * 0.5,
      this.game.world.centerY * 0.8,
      'logo'
    );
    logo.anchor.setTo(0.5, 0.5);

    let joinBtn = this.game.add.button(
      this.game.world.centerX * 1.5,
      this.game.world.centerY,
      'menu__join-button',
      this.goToGames,
      this,
      1,
      0
    );
    joinBtn.anchor.setTo(0.5, 0.5);

    this.createCredits();

    this.createNameField();
  }

  shutdown ()
  {
    this.nameField.parentNode.removeChild(this.nameField);
  }

  createCredits ()
  {
    let credits = this.game.add.text(
      5,
      this.game.height,
      `Credits:\nProgramista: Tomasz 'Ivan' Kłusak\nGraficy: Bartek Wiercigroch, Grzesiu Witos, Kamil Glac\nMuzyka (soon): Radek Niemczycki`,
      {
        fill: '#fff',
        font: '400 10px Exo'
      }
    );
    credits.anchor.setTo(0, 1);
  }

  createNameField ()
  {
    let nameField = document.createElement('input');
    nameField.setAttribute('type', 'text');
    nameField.id = 'name-field';
    nameField.setAttribute('placeholder', 'Twój wspaniały pseudonim');
    nameField.setAttribute('maxlength', 16);
    nameField.classList.add('name-field');
    nameField.style.left = `${this.game.world.centerX * 1.5}px`;
    nameField.style.top = `${this.game.world.centerY - 100}px`;
    nameField.style.transform = 'translate(-50%, -50%)';

    this.nameField = nameField;

    document.querySelector('#game').appendChild(nameField);
  }

  createErrorField (text)
  {
    if (this.fieldError)
    {
      this.fieldError.setText(text);
      return;
    }

    this.fieldError = this.game.add.text(
      this.game.world.centerX * 1.5,
      this.game.world.centerY - 70,
      text.toString(),
      {
        font: '400 13px Exo',
        fill: '#fd5151'
      }
    );
    this.fieldError.anchor.setTo(0.5, 0.5);
  }

  goToGames ()
  {
    if (this.nameField.value.length === 0)
    {
      return this.createErrorField('Wprowadź swój tajemniczy pseudonim!');
    }
    else if (this.nameField.value.length < 3 || this.nameField.value.length > 16)
    {
      return this.createErrorField('Twój tajemniczy pseudonim może mieć od 3-16 znaków!');
    }

    this.game.currentUser.name = this.nameField.value;

    this.state.start('Lobbies');
  }
}
