'use strict';

import {database} from '../utils';
import Bullet from './Bullet';

class Bullets
{
  constructor (game, gameKey)
  {
    this.game = game;
    this._dbRef = database.ref(`games/${gameKey}/bullets`);

    this.map = new Map();

    this._listenNewBullet();
  }

  _listenNewBullet ()
  {
    this._dbRef.on('child_added', (snapshot) => this.createBullet(snapshot.key, snapshot.val()));
  }

  createBullet (key, data)
  {
    this.map.set(key, new Bullet(
      this.game,
      data.x,
      data.y,
      data.size,
      data.angle,
      data.velocity,
      data.owner,
      data.power
    ));
  }

}

export default Bullets;
