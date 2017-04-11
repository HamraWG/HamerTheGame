'use strcit';

import Phaser from 'phaser';
import Player from './Player';

class CurrentPlayer extends Player
{
  constructor (dbRef, game)
  {
    super(dbRef, game);

    this.game = game;

    this.addMovementKeyListeners();
  }

  addMovementKeyListeners ()
  {
    let keyboard = this.game.input.keyboard;

    let moveUp = keyboard.addKey(Phaser.Keyboard.W);
    let moveDown = keyboard.addKey(Phaser.Keyboard.S);
    let moveLeft = keyboard.addKey(Phaser.Keyboard.A);
    let moveRight = keyboard.addKey(Phaser.Keyboard.D);
  }
}

export default CurrentPlayer;
