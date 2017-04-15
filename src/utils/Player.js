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
    this.direction = null;

    this.createChampion();
    this.createPlayerName();
    this.createPlayerHands();
    this.createWeaponSprite();
    this.game.add.existing(this);

    this.eventEmitter.once('value', () => this.positionObjectsUpdate(this));
    this._listenChange();
    this._addAnimations();
    console.log(this);
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
    this.playerName = new Phaser.Text(this.game, 0, 0, '', {
      font: '400 14px Exo',
      fill: '#fff'
    });
    this.playerName.setShadow(3, 3, 'rgba(0,0,0,0.8)', 3);
    this.playerName.anchor.set(0.5, 1);

    this.add(this.playerName);
  }

  createPlayerHands ()
  {
    this.hands = {
      left: new Phaser.Sprite(this.game, 20, 20, 'champ:one:hand', 0),
      right: new Phaser.Sprite(this.game, 20, 20, 'champ:one:hand', 0)
    };

    this.hands.left.anchor.set(0.5, 1);
    this.hands.right.anchor.set(0.5, 1);

    this.add(this.hands.left);
    this.add(this.hands.right);
  }

  createWeaponSprite ()
  {
    this.weaponSprite = new Phaser.Sprite(this.game, 0, 0, 'weapons', 0);
    this.weaponSprite.anchor.set(0, 0.5);
    this.weaponSprite.defaultFrame = 0;
    this.addAt(this.weaponSprite, 0);
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

  positionObjectsUpdate ()
  {
    this.champion.x = this._position.x;
    this.champion.y = this._position.y;
    this.champion.visible = true;

    this.playerName.text = this._name;
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
    this.direction = this.countPlayerDirection(
      this.game.input.worldX,
      this.game.input.worldY,
      this.champion.body,
      {
        x: this.champion.width,
        y: this.champion.height
      }
    );

    this.updatePlayerPosition();
    this.updatePlayerNamePosition();
    this.updatePlayerHealth();
    this.updatePlayerFrame();
    this.updatePlayerHandsPosition();
    this.updatePlayerWeaponPosition();
  }

  updatePlayerPosition ()
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
  }

  updatePlayerNamePosition ()
  {
    this.playerName.x = this.champion.body.x + this.champion.width / 2;
    this.playerName.y = this.champion.body.y;
  }

  updatePlayerHealth ()
  {
    let healthAlpha = this._hp / 100;
    this.alpha = healthAlpha;
  }

  updatePlayerFrame ()
  {
    if (this.champion.body.velocity.x !== 0 || this.champion.body.velocity.y !== 0)
    {
      this.champion.animations.play(this.direction);
    }
    else
    {
      this.champion.animations.play(this.direction);
      this.champion.animations.stop();
    }
  }

  updatePlayerHandsPosition ()
  {
    let angleRight = this.game.physics.arcade.angleToPointer(this.hands.right);
    let angleLeft = this.game.physics.arcade.angleToPointer(this.hands.left);
    switch (this.direction)
    {
      case 'up':
        this.sendToBack(this.hands.left);
        this.sendToBack(this.hands.right);
        this.hands.left.visible = true;
        this.hands.right.visible = true;

        this.hands.left.x = this.champion.body.x + 5;
        this.hands.left.y = this.champion.body.y + 23;

        this.hands.right.x = this.champion.body.right - 5;
        this.hands.right.y = this.champion.body.y + 23;

        this.hands.left.rotation = angleLeft + Math.PI * 0.6;
        this.hands.right.rotation = angleRight + Math.PI * 0.35;
        break;

      case 'down':
        this.bringToTop(this.hands.left);
        this.bringToTop(this.hands.right);
        this.hands.left.visible = true;
        this.hands.right.visible = true;

        this.hands.left.x = this.champion.body.x + 5;
        this.hands.left.y = this.champion.body.y + 23;

        this.hands.right.x = this.champion.body.right - 5;
        this.hands.right.y = this.champion.body.y + 23;

        this.hands.left.rotation = angleLeft + Math.PI * 0.4;
        this.hands.right.rotation = angleRight + Math.PI * 0.6;
        break;

      case 'left':
        this.bringToTop(this.hands.left);
        this.bringToTop(this.hands.right);
        this.hands.left.visible = true;
        this.hands.right.visible = false;

        this.hands.left.x = this.champion.body.right - 14;
        this.hands.left.y = this.champion.body.y + 23;

        this.hands.left.rotation = angleLeft + Math.PI * 0.5;
        break;

      case 'right':
        this.bringToTop(this.hands.left);
        this.bringToTop(this.hands.right);
        this.hands.left.visible = false;
        this.hands.right.visible = true;

        this.hands.right.x = this.champion.body.left + 14;
        this.hands.right.y = this.champion.body.y + 23;

        this.hands.right.rotation = angleRight + Math.PI * 0.55;
        break;
    }
  }

  updatePlayerWeaponPosition ()
  {
    let angle = null;
    switch (this.direction)
    {
      case 'right':
        angle = this.game.physics.arcade.angleToPointer(this.weaponSprite);
        this.bringToTop(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame;
        this.weaponSprite.anchor.set(0, 0.5);

        this.weaponSprite.x = this.hands.right.right + this.hands.right.width;
        this.weaponSprite.y = this.hands.right.y;

        this.weaponSprite.rotation = angle;
        break;

      case 'left':
        angle = this.game.physics.arcade.angleToPointer(this.weaponSprite);
        this.bringToTop(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame + 2;
        this.weaponSprite.anchor.set(1, 0.5);

        this.weaponSprite.x = this.hands.left.left - this.hands.left.width;
        this.weaponSprite.y = this.hands.left.y;

        this.weaponSprite.rotation = angle + Math.PI;
        break;

      case 'down':
        angle = this.game.physics.arcade.angleToPointer(this.weaponSprite);
        this.bringToTop(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame + 3;
        this.weaponSprite.anchor.set(0.5, 0);

        this.weaponSprite.x = this.champion.centerX;
        this.weaponSprite.y = this.champion.centerY - 3;

        this.weaponSprite.rotation = angle - Math.PI * 0.5;
        break;

      case 'up':
        angle = this.game.physics.arcade.angleToPointer(this.weaponSprite);
        this.sendToBack(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame + 1;
        this.weaponSprite.anchor.set(0.5, 1);

        this.weaponSprite.x = this.champion.centerX;
        this.weaponSprite.y = this.champion.y + 5;

        this.weaponSprite.rotation = angle + Math.PI * 0.5;
        break;
    }
  }

  countPlayerDirection (cursorX, cursorY, bodyPos, bodySize)
  {
    let distance = {};
    distance.x = cursorX - (bodyPos.x + bodySize.x / 2);
    distance.y = cursorY - (bodyPos.y + bodySize.y / 2);

    let directionAxis = Math.abs(distance.x) < Math.abs(distance.y) ? 'y' : 'x';

    let direction = null;
    if (directionAxis === 'x')
    {
      direction = distance.x <= 0 ? 'left' : 'right';
    }
    else
    {
      direction = distance.y <= 0 ? 'up' : 'down';
    }

    return direction;
  }

  _addAnimations ()
  {
    let animationSpeed = 10;

    this.champion.animations.add('down', [0, 1, 2, 3], animationSpeed, true);
    this.champion.animations.add('left', [4, 5, 6, 7], animationSpeed, true);
    this.champion.animations.add('right', [8, 9, 10, 11], animationSpeed, true);
    this.champion.animations.add('up', [12, 13, 14, 15], animationSpeed, true);
  }
}

export default Player;
