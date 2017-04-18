'use strict';

class Weapon
{
  constructor (owner, dbBulletsRef)
  {
    this.owner = owner;
    this.sprite = owner.weaponSprite;
    this.game = owner.game;
    this._bulletsRef = dbBulletsRef;

    this.type = 'ak47';

    this.listenFireButton();
  }

  listenFireButton ()
  {
    this.game.input.onDown.add(this.fire, this);
  }

  getBulletSize (type)
  {
    let size = null;
    switch (type || this.type)
    {
      case 'ak47':
        size = 3;
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
        velocity = 600;
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
        power = 20;
        break;
    }

    return power;
  }

  fire ()
  {
    console.log(this.owner.visible);
    if (this.owner.hp <= 0 || this.owner.visible === false) return;

    let angle = this.game.physics.arcade.angleToPointer(this.sprite);

    this._bulletsRef.push({
      x: this.sprite.x,
      y: this.sprite.y,
      size: this.getBulletSize(),
      angle: angle,
      velocity: this.getBulletVelocity(),
      owner: this.game.currentUser.key,
      power: this.getBulletPower()
    });
  }
}

export default Weapon;
