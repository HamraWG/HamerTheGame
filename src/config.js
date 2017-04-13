import Phaser from 'phaser';

export default
{
  gameWidth: window.innerWidth,
  gameHeight: window.innerHeight,

  firebase: {
    apiKey: 'AIzaSyB_2EWiop4bh5Uv8a4NKmsuV95wNEXMw2s',
    authDomain: 'hamer-the-game.firebaseapp.com',
    databaseURL: 'https://hamer-the-game.firebaseio.com',
    storageBucket: 'hamer-the-game.appspot.com',
    messagingSenderId: '964483972641'
  },

  controls: {
    up: Phaser.Keyboard.W,
    down: Phaser.Keyboard.S,
    right: Phaser.Keyboard.D,
    left: Phaser.Keyboard.A
  }
};
