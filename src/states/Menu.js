'use strict';

import Phaser from 'phaser';

export default class extends Phaser.State
{
  init ()
  {
    this.stage.backgroundColor = '#191919';
  }

  create ()
  {
    this.createBackground();
    this.createLogo();
    this.createJoinButton();
    // this.createCredits();
  }

  createJoinButton ()
  {
    let $joinButton = this.game.add.button(
      this.game.world.centerX * 1.6,
      this.game.world.centerY * 1.3,
      'menu.join_button'
    );
    $joinButton.anchor.setTo(0.5, 0.5);

    
  }

  createBackground ()
  {
    this.game.add.image(0, 0, 'menu.background_pixels');
  }

  createLogo ()
  {
    let logo = this.game.add.image(
      this.game.world.centerX * 1.6,
      this.game.world.centerY * 0.7,
      'logo'
    );
    logo.anchor.setTo(0.5, 0.5);
  }

  createCredits ()
  {
    let credits = this.game.add.text(
      5,
      this.game.height,
      `Credits:\nProgramista: Tomasz 'Ivan' Kłusak\nGraficy: Bartek Wiercigroch, Grzesiu Witos, Kamil Glac`,
      {
        fill: '#fff',
        font: '400 10px Exo'
      }
    );
    credits.anchor.setTo(0, 1);
  }
}
