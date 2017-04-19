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

    this._key = null;
    this._name = null;
    this._skin = null;
    this._online = null;
    this._hp = null;
    this._position = null;
    this._stats = null;
    this.lastRespawn = 0;
    this._respawn = 0;
    this.created = false;

    this.velocity = 300;
    this.direction = null;

    this.eventEmitter.once('value', () => this.firstUpdate(this));
    this._listenChange();
  }

  get key ()
  {
    return this._key;
  }

  get name ()
  {
    return this._name;
  }

  get skin ()
  {
    return this._skin;
  }

  get online ()
  {
    return this._online;
  }

  set online (online)
  {
    if (typeof online !== 'boolean') throw new TypeError('`online` must be a boolean');

    this._dbRef.update({
      online: online
    });
  }

  get hp ()
  {
    return this._hp;
  }

  set hp (hp)
  {
    if (typeof hp !== 'number') throw new TypeError('`hp` must be a number');

    if (hp <= 0)
    {
      this.kill();
    }

    this._dbRef.update({
      hp: hp
    });
  }

  get stats ()
  {
    return this._stats;
  }

  addKill (key)
  {
    this._dbRef.child('stats/kills').update({
      [key]: this.stats.kills[key] + 1 || 1
    });
  }

  addDeath (key)
  {
    this._dbRef.child('stats/deaths').update({
      [key]: this.stats.deaths[key] + 1 || 1
    });
  }

  get eq ()
  {
    return this._eq;
  }

  firstUpdate ()
  {
    if (this.created === false)
    {
      this.createChampion();
      this.createPlayerName();
      this.createPlayerHands();
      this.createWeaponSprite();
      this.game.add.existing(this);

      this._addAnimations();
      this._onResume();

      this.created = true;
    }

    this.instantlyPositionUpdate(this);
    this.lastRespawn = this._respawn;
    this.champion.visible = true;
    this.visible = this.online;
  }

  getPosition ()
  {
    return this._position;
  }

  kill ()
  {
    this.lastHit.addKill(this.key);
    this.addDeath(this.lastHit.key);
  }

  createChampion ()
  {
    this.champion = new Phaser.Sprite(this.game, 0, 0, `champ:${this.skin}`, 0);
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
      left: new Phaser.Sprite(this.game, 0, 0, `champ:${this.skin}:hand`, 0),
      right: new Phaser.Sprite(this.game, 0, 0, `champ:${this.skin}:hand`, 0)
    };

    this.hands.left.anchor.set(0.5, 1);
    this.hands.right.anchor.set(0.5, 1);

    this.add(this.hands.left);
    this.add(this.hands.right);
  }

  createWeaponSprite ()
  {
    let weaponFrame = this.getWeaponFrame();

    this.weaponSprite = new Phaser.Sprite(this.game, 0, 0, 'weapons', weaponFrame);
    this.weaponSprite.anchor.set(0, 0.5);
    this.weaponSprite.defaultFrame = weaponFrame;
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
      let connectState = false;
      if (this._online !== data.online) connectState = true;

      this._key = snapshot.key;
      this._skin = data.skin;
      this._name = data.name;
      this._online = data.online;
      this._hp = data.hp;
      this._position = data.position;
      this._stats = data.stats;
      this._respawn = data.respawn;

      if (connectState) this.eventEmitter.emitEvent('connection', [this]);
      this.eventEmitter.emitEvent('value', [this]);
    });
  }

  instantlyPositionUpdate ()
  {
    this.champion.x = this._position.x;
    this.champion.y = this._position.y;

    this.playerName.text = this._name;
  }

  respawn (x, y)
  {
    this._dbRef.update({
      hp: 100,
      respawn: this._respawn + 1,
      position: {
        x: x,
        y: y
      }
    });
  }

  update ()
  {
    let cursorX = this.game.input.worldX;
    let cursorY = this.game.input.worldY;

    this.direction = this.countPlayerDirection(
      cursorX,
      cursorY,
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

    if (this.lastRespawn !== this._respawn)
    {
      this.instantlyPositionUpdate();
      if (this.isCP) this.moveTestToPlayer();

      this.lastRespawn = this._respawn;
      return;
    }

    this.updateDesynchro();

    if (bodyPos.x !== playerPos.x)
    {
      bodyPos.velocity.x = playerPos.x > bodyPos.x ? this.velocity : -this.velocity;
    }
    if (bodyPos.y !== playerPos.y)
    {
      bodyPos.velocity.y = playerPos.y > bodyPos.y ? this.velocity : -this.velocity;
    }
  }

  updateDesynchro ()
  {
    let playerPos = this.getPosition();
    let bodyPos = this.champion.body;

    let xDiff = Math.abs(playerPos.x) - Math.abs(bodyPos.x);
    let yDiff = Math.abs(playerPos.y) - Math.abs(bodyPos.y);

    if (Math.abs(xDiff) > 96 || Math.abs(yDiff) > 96)
    {
      this.instantlyPositionUpdate();
      if (this.isCP) this.moveTestToPlayer();
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
    let angle = this.game.physics.arcade.angleToPointer(this.weaponSprite);
    switch (this.direction)
    {
      case 'right':
        this.bringToTop(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame;
        this.weaponSprite.anchor.set(0, 0.5);

        this.weaponSprite.x = this.hands.right.right + this.hands.right.width;
        this.weaponSprite.y = this.hands.right.y;

        this.weaponSprite.rotation = angle;
        break;

      case 'left':
        this.bringToTop(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame + 2;
        this.weaponSprite.anchor.set(1, 0.5);

        this.weaponSprite.x = this.hands.left.left - this.hands.left.width;
        this.weaponSprite.y = this.hands.left.y;

        this.weaponSprite.rotation = angle + Math.PI;
        break;

      case 'down':
        this.bringToTop(this.weaponSprite);
        this.weaponSprite.frame = this.weaponSprite.defaultFrame + 3;
        this.weaponSprite.anchor.set(0.5, 0);

        this.weaponSprite.x = this.champion.centerX;
        this.weaponSprite.y = this.champion.centerY - 3;

        this.weaponSprite.rotation = angle - Math.PI * 0.5;
        break;

      case 'up':
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

  _onResume ()
  {
    this.game.onResume.add(() =>
    {
      this.instantlyPositionUpdate();
    }, this);
  }

  getWeaponFrame ()
  {
    if (this.skin === null) throw new Error('Skin is not loaded yet!');

    let startFrame = null;

    switch (this.skin)
    {
      case 'kamil':
        startFrame = 0;
        break;
      case 'ninja':
        startFrame = 16;
        break;
      case 'rambo':
        startFrame = 12;
        break;
    }

    return startFrame;
  }
}

export default Player;
