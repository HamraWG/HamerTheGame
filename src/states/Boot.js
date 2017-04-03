import Phaser from 'phaser';
import WebFont from 'webfontloader';

export default class extends Phaser.State
{
  init ()
  {
    this.fontsLoaded = this.fontsLoaded.bind(this);

    this.stage.backgroundColor = '#1d1b19';
    this.fontsReady = false;
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
    this.load.image('m-logo', 'assets/images/m-logo.png');
    this.load.image('logo', 'assets/images/logo.png');
    this.load.spritesheet('menu__join-button', 'assets/images/menu/join-button.png', 318, 50);

    // Loading info
    let loadingText = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'Wczytywanie tajemniczych danych.',
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
    // FIXME(Ivan): Go to the Menu!
    if (this.fontsReady) this.state.start('Menu');
  }

  fontsLoaded ()
  {
    this.fontsReady = true;
  }
}
