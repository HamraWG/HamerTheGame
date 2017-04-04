import Phaser from 'phaser';

export default class extends Phaser.State
{
  init ()
  {
    this.nameField = null;
    this.fieldError = null;

    this.stage.backgroundColor = '#1d1b19';
  }

  preload ()
  {}

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

    this.createNameField();
  }

  shutdown ()
  {
    this.nameField.parentNode.removeChild(this.nameField);
  }

  createNameField ()
  {
    let nameField = document.createElement('input');
    nameField.setAttribute('type', 'text');
    nameField.id = 'name-field';
    nameField.setAttribute('placeholder', 'Twój wspaniały pseudonim');
    nameField.setAttribute('maxlength', 16);
    nameField.classList.add('name-field');

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
      this.game.camera.width - 53,
      210,
      text.toString(),
      {
        font: '400 12px Exo',
        fill: '#fd5151'
      }
    );
    this.fieldError.anchor.setTo(1, 1);
  }

  goToGames ()
  {
    if (this.nameField.value.length < 3 || this.nameField.value.length > 16)
    {
      return this.createErrorField('Wprowadź swój tajemniczy pseudonim!');
    }

    this.game.currentUser.name = this.nameField.value;

    this.state.start('Lobbies');
  }
}
