'use strict';

import Player from './Player';
import Phaser from 'phaser';
import config from '../config';

class CurrentPlayer extends Player
{
  constructor (game, dbRef)
  {
    super(game, dbRef);

    this.game.camera.follow(this);
    this.moveUnit = 5;

    // this.addMovementKeyListeners();
  }

  addMovementKeyListeners ()
  {
    let keyboard = this.game.input.keyboard;

    keyboard.addKey(config.controls.up).onHoldCallback = () => this.move('up');
    keyboard.addKey(config.controls.right).onHoldCallback = () => this.move('right');
    keyboard.addKey(config.controls.down).onHoldCallback = () => this.move('down');
    keyboard.addKey(config.controls.left).onHoldCallback = () => this.move('left');
  }

  move (direction)
  {
    if (direction !== 'up' && direction !== 'right' && direction !== 'down' && direction !== 'left')
    {
      throw new TypeError('`direction` must be a string equals `up`, `right`, `down` or `left`');
    }

    let lines = this._createMoveLines(direction);
    let test = this._testMove(lines);
  }

  _testMove (lines)
  {
    // FIXME(Ivan): Test if player is near to the world border.
    let test1 = this.game.layers.walls.getRayCastTiles(lines[0], 0);
    let test2 = this.game.layers.walls.getRayCastTiles(lines[1], 0);

    console.log(test1, test2);
    return false;
  }

  _createMoveLines (direction)
  {
    if (direction !== 'up' && direction !== 'right' && direction !== 'down' && direction !== 'left')
    {
      throw new TypeError('`direction` must be a string equals `up`, `right`, `down` or `left`');
    }

    let lines = [
      new Phaser.Line(),
      new Phaser.Line()
    ];

    let body = this.body;

    switch (direction)
    {
      case 'up':
        lines[0].start.set(body.left, body.top);
        lines[0].end.set(body.left, body.top - this.moveUnit);

        lines[1].start.set(body.right, body.top);
        lines[1].end.set(body.right, body.top - this.moveUnit);
        break;

      case 'right':
        lines[0].start.set(body.right, body.top);
        lines[0].end.set(body.right + this.moveUnit, body.top);

        lines[1].start.set(body.right, body.bottom);
        lines[1].end.set(body.right + this.moveUnit, body.bottom);
        break;

      case 'down':
        lines[0].start.set(body.left, body.top);
        lines[0].end.set(body.left, body.top + this.moveUnit);

        lines[1].start.set(body.right, body.top);
        lines[1].end.set(body.right, body.top + this.moveUnit);
        break;

      case 'left':
        lines[0].start.set(body.right, body.top);
        lines[0].end.set(body.right - this.moveUnit, body.top);

        lines[1].start.set(body.right, body.bottom);
        lines[1].end.set(body.right - this.moveUnit, body.bottom);
        break;
    }

    return lines;
  }
}

export default CurrentPlayer;
