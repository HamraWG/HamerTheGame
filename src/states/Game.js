'use strict';

import Phaser from 'phaser';
import CurrentPlayer from '../utils/CurrentPlayer';
import Player from '../utils/Player';
import Bullets from '../utils/Bullets';

export default class extends Phaser.State
{
  init (dbGame)
  {
    this.dbGame = dbGame;
    this.deathTime = 1;
    this.deathStateStatus = false;
  }

  shutdown ()
  {
    this.game.map = undefined;
    this.game.layers = undefined;
  }

  create ()
  {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.map = this.game.add.tilemap(`map-${this.dbGame.map}`);
    this.game.map.addTilesetImage(`tiles-${this.dbGame.map}`);

    this.game.layers = {};
    this.game.layers.layer = this.game.map.createLayer('layer');
    this.game.layers.layer.resizeWorld();

    this.game.map.setCollisionBetween(2, 12);

    this.keyboard = this.game.input.keyboard;
    this.players = new Map();
    this.createPlayers();

    this.bullets = new Bullets(this.game, this.dbGame.key);

    this.createTimer();
    this.createDeathState();
  }

  createPlayers ()
  {
    for (let playerKey in this.dbGame.players)
    {
      let player = playerKey === this.game.currentUser.key ? new CurrentPlayer(this.game, this.dbGame.getPlayerRef(playerKey)) : new Player(this.game, this.dbGame.getPlayerRef(playerKey))
      player.eventEmitter.on('connection', this.onConnectionPlayer);

      if (player instanceof CurrentPlayer)
      {
        this.respawnPlayer(player);
      }

      this.players.set(playerKey, player);
    }
  }

  onConnectionPlayer (player)
  {
    if (player.online) player.visible = true;
    else player.visible = false;
  }

  respawnPlayer (player)
  {
    let respawns = this.game.map.properties.respawn;
    let randomIndex = Math.floor(Math.random() * respawns.length);

    let respawnTile = this.game.map.getTile(respawns[randomIndex][0], respawns[randomIndex][1], this.game.layers.layer);

    player.hp = 100;
    player.setInstantlyPosition(respawnTile.worldX, respawnTile.worldY);
  }

  update ()
  {
    if (this.deathState.visible === false) this.game.canvas.style.cursor = 'crosshair';

    this.updatePlayersPosition();
    this.updateBullets();
    this.updateTimer();
  }

  updatePlayersPosition ()
  {
    this.players.forEach((player) =>
    {
      this.game.physics.arcade.collide(player.champion, this.game.layers.layer);

      player.champion.body.velocity.x = 0;
      player.champion.body.velocity.y = 0;

      if (player instanceof CurrentPlayer)
      {
        this.game.physics.arcade.collide(player.hitTestObject, this.game.layers.layer);

        player.hitTestObject.body.velocity.x = 0;
        player.hitTestObject.body.velocity.y = 0;

        this.updateDeathState(player);
      }

      player.update();
    });
  }

  updateBullets ()
  {
    this.bullets.forEach((bullet) =>
    {
      let layerCollide = this.game.physics.arcade.collide(bullet, this.game.layers.layer);
      let collidedPlayer = null;

      this.players.forEach((player) =>
      {
        if (collidedPlayer !== null) return;
        if (player.live === false) return;

        this.game.physics.arcade.overlap(player.champion, bullet, () =>
        {
          collidedPlayer = player;
        });
      });

      if (layerCollide === true)
      {
        bullet.remove();
        this.bullets.set.delete(bullet);

        return;
      }

      if (collidedPlayer)
      {
        if (bullet.owner === collidedPlayer.key) return;
        if (collidedPlayer.hp <= 0 || collidedPlayer.visible === false) return;

        bullet.hit(this.players.get(bullet.owner), collidedPlayer);
        this.bullets.set.delete(bullet);

        return;
      }

      bullet.update();
    });
  }

  updateTimer ()
  {
    let toTheEnd = this.dbGame.end - Date.now();
    this.timer.time.setText(toTheEnd);
  }

  createTimer ()
  {
    this.timer = new Phaser.Group(this.game);
    this.timer.fixedToCamera = true;

    let background = new Phaser.Graphics(this.game);
    background.beginFill(0x151515);
    background.drawRect(0, 0, 80, 40);

    let time = new Phaser.Text(
      this.game,
      5,
      10,
      '00:00',
      {
        fill: '#fff',
        font: '400 16px Exo'
      }
    );

    this.timer.add(background);
    this.timer.time = time;
    this.timer.add(time);

    this.game.add.existing(this.timer);
  }

  updateDeathState (player)
  {
    if (this.deathStateStatus === false)
    {
      this.deathState.button.setFrames(0);
    }

    if (player.hp <= 0 && this.deathStateStatus === false)
    {
      this.deathStateStatus = true;
      this.deathState.visible = true;
      this.deathState.alpha = 0;

      let text = player.lastHit ? `${player.lastHit.name} zabił/a Cię!` : 'Zostałeś/aś zabity/a';
      this.deathState.text.setText(text);

      this.game.time.events.add(this.deathTime * 1000, () =>
      {
        this.deathState.button.setFrames(1, 2);
        this.deathState.button.onInputDown.add(() =>
        {
          this.respawnPlayer(player);

          this.deathState.visible = false;
          this.deathStateStatus = false;
        });
      });

      this.game.add.tween(this.deathState).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true);
    }
  }

  createDeathState ()
  {
    this.deathState = new Phaser.Group(this.game);
    this.deathState.fixedToCamera = true;

    let background = new Phaser.Graphics(this.game);
    background.beginFill(0xa70950, 0.4);
    background.drawRect(0, 0, this.game.width, this.game.height);

    let text = new Phaser.Text(
      this.game,
      this.camera.width * 0.5,
      this.camera.height * 0.4,
      'Death State!',
      {
        fill: '#fff',
        font: '400 24px Exo'
      }
    );
    text.anchor.set(0.5, 0.5);

    let button = new Phaser.Button(
      this.game,
      this.game.width * 0.5,
      this.camera.height * 0.5,
      'respawn-button'
    );
    button.anchor.set(0.5, 0.5);

    this.deathState.add(background);
    this.deathState.text = text;
    this.deathState.add(text);
    this.deathState.button = button;
    this.deathState.add(button);

    this.deathState.visible = false;
    this.game.add.existing(this.deathState);
  }
}
