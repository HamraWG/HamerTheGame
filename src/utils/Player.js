'use strict';

import Phaser from 'phaser';
import EventEmitter from 'wolfy87-eventemitter';

/**
 * Class representing Player.
 */
class Player extends Phaser.Group
{
  /**
   * Creates Player instance.
   *
   * @param {Phaser.Game} game
   * @param {firebase.Database} dbRef
   */
  constructor (game, dbRef)
  {
    super(game);
    this._dbRef = dbRef;
    this.eventEmitter = new EventEmitter();

    this.velocity = 300;

    this.createChampion();
    this.createPlayerName();
    this.game.add.existing(this);

    this.eventEmitter.once('value', () => this.instantPositionUpdate(this));
    this._listenChange();
  }

  createChampion ()
  {
    this.champion = new Phaser.Sprite(this.game, 0, 0, 'champ:one', 0);
    this.champion.visible = false;
    this.game.physics.enable(this.champion);
    this.champion.body.collideWorldBounds = true;

    this.add(this.champion);
  }

  createPlayerName ()
  {
    this.playerName = new Phaser.Text(this.game, 0, 0, 'elo', {
      font: '400 14px Exo',
      fill: '#fff'
    });
    this.playerName.setShadow(3, 3, 'rgba(0,0,0,0.8)', 3);
    this.playerName.anchor.set(0.5, 1);

    this.add(this.playerName);
  }

  /**
   * Listens changes in database.
   */
  _listenChange ()
  {
    this._dbRef.on('value', (snapshot) =>
    {
      if (snapshot.exists() === false) return;

      let data = snapshot.val();

      this._key = snapshot.key;
      this._name = data.name;
      this._hp = data.hp;
      this._alive = data.alive;
      this._position = data.position;
      this._stats = data.stats;
      this._eq = data.eq;

      this.eventEmitter.emitEvent('value', [this]);
    });
  }

  instantPositionUpdate ()
  {
    this.champion.x = this._position.x;
    this.champion.y = this._position.y;
    this.champion.visible = true;

    this.playerName.text = this._name;
    this.positionPlayerName();
  }

  /**
   * Returns player's position.
   *
   * @returns {object}
   */
  getPosition ()
  {
    return this._position;
  }

  update ()
  {
    let playerPos = this.getPosition();
    let bodyPos = this.champion.body;
    if (bodyPos.x !== playerPos.x)
    {
      bodyPos.velocity.x = playerPos.x > bodyPos.x ? this.velocity : -this.velocity;
    }
    if (bodyPos.y !== playerPos.y)
    {
      bodyPos.velocity.y = playerPos.y > bodyPos.y ? this.velocity : -this.velocity;
    }

    this.positionPlayerName();
  }

  positionPlayerName ()
  {
    this.playerName.x = this.champion.body.x + this.champion.width / 2;
    this.playerName.y = this.champion.body.y;
  }

  _addAnimations ()
  {
    let animationSpeed = 10;

    this.animations.add('down', [0, 1, 2, 3], animationSpeed, true);
    this.animations.add('left', [4, 5, 6, 7], animationSpeed, true);
    this.animations.add('right', [8, 9, 10, 11], animationSpeed, true);
    this.animations.add('up', [12, 13, 14, 15], animationSpeed, true);
  }
}

export default Player;
