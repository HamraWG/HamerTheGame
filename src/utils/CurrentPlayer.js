'use strict';

import Player from './Player';
import Phaser from 'phaser';

class CurrentPlayer extends Player
{
  constructor (game, dbRef)
  {
    super(game, dbRef);

    this.game.camera.follow(this);

    this.addMovementKeyListeners();
  }

  addMovementKeyListeners ()
  {

  }
}

export default CurrentPlayer;
