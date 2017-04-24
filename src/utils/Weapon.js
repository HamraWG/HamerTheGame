'use strict';

class Weapon
{
  constructor (owner, dbBulletsRef)
  {
    this.owner = owner;
    this.sprite = owner.weaponSprite;
    this.game = owner.game;
    this._bulletsRef = dbBulletsRef;

    this.type = null;
    this.ammo = null;
    this.isReloading = false;

    this.listenFireButton();
  }

  static getTypeByFrame (frame)
  {
    let type = null;
    switch (frame)
    {
      case 0:
        type = 'ak47';
        break;
      case 4:
        type = 'pistol';
        break;
      case 8:
        type = 'm4';
        break;
      case 12:
        type = 'shotgun';
        break;
      case 16:
        type = 'awp';
        break;
    }

    return type;
  }

  listenFireButton ()
  {
    this.game.input.onDown.add(this.fire, this);
  }

  getWeaponReloadTime (type)
  {
    let time = 0;
    switch (type || this.type)
    {
      case 'ak47':
        time = 1200;
        break;

      case 'awp':
        time = 1500;
        break;

      case 'shotgun':
        time = 600;
        break;
    }

    return time;
  }

  getBulletSize (type)
  {
    let size = null;
    switch (type || this.type)
    {
      case 'ak47':
        size = 3;
        break;

      case 'awp':
        size = 5;
        break;

      case 'shotgun':
        size = 2;
        break;
    }

    return size;
  }

  getBulletVelocity (type)
  {
    let velocity = null;
    switch (type || this.type)
    {
      case 'ak47':
        velocity = 1000;
        break;

      case 'awp':
        velocity = 1500;
        break;

      case 'shotgun':
        velocity = 1000;
        break;
    }

    return velocity;
  }

  getBulletPower (type)
  {
    let power = null;
    switch (type || this.type)
    {
      case 'ak47':
        power = 15;
        break;

      case 'awp':
        power = 90;
        break;

      case 'shotgun':
        power = 15;
        break;
    }

    return power;
  }

  getWeaponFireBulletsAmount (type)
  {
    let amount = null;
    switch (type || this.type)
    {
      case 'shotgun':
        amount = 4;
        break;
      default:
        amount = 1;
        break;
    }

    return amount;
  }

  getMaxAmmo (type)
  {
    let ammo = null;
    switch (type || this.type)
    {
      case 'ak47':
        ammo = 20;
        break;

      case 'awp':
        ammo = 1;
        break;

      case 'shotgun':
        ammo = 4;
        break;
    }

    return ammo;
  }

  getReloadTime (type)
  {
    let reload = null;
    switch (type || this.type)
    {
      case 'ak47':
        reload = 650;
        break;

      case 'awp':
        reload = 1500;
        break;

      case 'shotgun':
        reload = 850;
        break;
    }

    return reload;
  }

  canFire ()
  {
    return this.owner.hp > 0 &&
      this.owner.visible !== false &&
      this.type !== null &&
      this.isReloading === false;
  }

  fire ()
  {
    if (this.canFire() === false) return;

    let bulletsAmount = this.getWeaponFireBulletsAmount();
    let pointerAngle = this.game.physics.arcade.angleToPointer(this.sprite);
    let startAngle = pointerAngle;
    let bulletAnglePerShot = Math.PI * 0.03;

    if (bulletsAmount > 1)
    {
      startAngle = startAngle - ((bulletsAmount / 2) * bulletAnglePerShot);
    }

    for (let i = 1; i <= bulletsAmount; i++)
    {
      this._bulletsRef.push({
        x: this.sprite.x,
        y: this.sprite.y,
        size: this.getBulletSize(),
        angle: startAngle,
        velocity: this.getBulletVelocity(),
        owner: this.game.currentUser.key,
        power: this.getBulletPower()
      });

      if (bulletsAmount > 1) startAngle += bulletAnglePerShot;

      this.ammo--;
    }

    if (this.ammo <= 0)
    {
      this.reload();
    }
  }

  reload ()
  {
    this.isReloading = true;

    this.game.time.events.add(this.getWeaponReloadTime(), () =>
    {
      this.isReloading = false;
      this.ammo = this.getMaxAmmo();
    });
  }
}

export default Weapon;
