'use strict';

import Phaser from 'phaser';

export default class extends Phaser.State
{
  init ()
  {}

  preload ()
  {
    this.game.load.tilemap('map', 'assets/maps/Elo.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/maps/tiles.png');
    this.game.load.spritesheet('champ:one', 'assets/champions/one.png', 32, 48);
  }

  create ()
  {
    let map = this.game.add.tilemap('map');
    map.addTilesetImage('tiles');

    let layer = map.createLayer(0);
    layer.resizeWorld();

    this.player = this.game.add.sprite(0, 0, 'champ:one', 0);
    this.player.smoothed = false;
    this.player.animations.add('down', [0, 1, 2, 3], 10, true);
    this.player.animations.add('up', [12, 13, 14, 15], 10, true);

    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  update ()
  {
    this.player.body.velocity.set(0);

    if (this.cursors.down.isDown)
    {
      this.player.body.velocity.y = 100;
      this.player.play('down');
    }
    else if (this.cursors.up.isDown)
    {
      this.player.body.velocity.y = -100;
      this.player.play('up');
    }
    else
    {
      this.player.animations.stop();
    }
  }
}
