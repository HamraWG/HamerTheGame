'use strict';

import {database} from '../utils';
import Bullet from './Bullet';

class Bullets
{
  constructor (game, gameKey)
  {
    this.game = game;
    this._dbRef = database.ref(`games/${gameKey}/bullets`);

    this.set = new Set();

    this._listenNewBullet();
  }

  _listenNewBullet ()
  {
    this._dbRef.on('child_added', (snapshot) => this.createBullet(snapshot.ref, snapshot.val()));
  }

  createBullet (ref, data)
  {
    this.set.add(new Bullet(
      this.game,
      data.x,
      data.y,
      data.size,
      data.angle,
      data.velocity,
      data.owner,
      data.power,
      ref
    ));
  }

  forEach (...args)
  {
    this.set.forEach(...args);
  }
}

export default Bullets;
