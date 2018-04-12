'use strict';

import Phaser from 'phaser';
import WebFont from 'webfontloader';
import {database} from '../utils';

export default class extends Phaser.State
{
  init ()
  {
    this.fontsLoaded = this.fontsLoaded.bind(this);

    this.stage.backgroundColor = '#191919';
    this.fontsReady = false;
    this.inGame = null;
  }

  preload ()
  {
    // Fonts
    WebFont.load({
      google: {
        families: ['Exo']
      },
      active: this.fontsLoaded
    });

    // Assets
    this.load.image('logo', 'assets/logo.png');
    this.load.image('menu.background_pixels', 'assets/menu/background_pixels.png');
    this.load.image('menu.join_button', 'assets/menu/join_button.png');

    this.checkIfUserIsInGame();

    // Loading info
    let loadingText = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Wczytywanie danych',
      {
        font: '16px Arial',
        fill: '#fff',
        align: 'center'
      }
    );
    loadingText.anchor.setTo(0.5, 0.5);
  }

  render ()
  {
    if (this.fontsReady && this.inGame !== null)
    {
      if (this.inGame === true)
      {
        this.state.start('GameLoader', true, false, localStorage.getItem('firebase:game:id'));

        return;
      }

      this.state.start('Menu');
    }
  }

  checkIfUserIsInGame ()
  {
    let gameKey = localStorage.getItem('firebse:game:id');
    if (!gameKey)
    {
      this.inGame = false;
      return;
    }

    database.ref(`games/${gameKey}`).once('value').then((snapshot) =>
    {
      if (snapshot.exists() === false)
      {
        this.inGame = false;
        return;
      }
      let data = snapshot.val();

      this.inGame = Date.now() < data.endTimestamp;
    });
  }

  fontsLoaded ()
  {
    this.fontsReady = true;
  }
}
