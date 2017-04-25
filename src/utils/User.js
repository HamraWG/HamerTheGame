'use strict';

import {database} from '../utils';

/**
 * Class representing a User.
 */
class User
{
  /**
   * Creates user instance.
   */
  constructor ()
  {
    this._dbRef = database.ref('users');
    this._dbKeyStorageRef = 'firebase.user';

    this._key = null;
    this._name = null;

    this.getOrCreateDbKey();
  }

  /**
   * Gets user key.
   *
   * @readonly
   * @returns {string|null}
   */
  get key ()
  {
    return this._key;
  }

  /**
   * Gets user name.
   *
   * @returns {string|null}
   */
  get name ()
  {
    return this._name;
  }

  /**
   * Set user name.
   *
   * @param {string|null} name User name.
   */
  set name (name)
  {
    if (typeof name !== 'string') throw new TypeError('name must be a non-empty string.');

    this._name = name;
    this._key = this._dbRef.push({
      name: name.toString(),
      createdAt: new Date().toISOString()
    }).key;

    localStorage.setItem(this._dbKeyStorageRef, this._key);
  }

  /**
   * Gets or create database key.
   *
   * @returns {undefined}
   */
  getOrCreateDbKey ()
  {
    let storeKey = localStorage.getItem(this._dbKeyStorageRef);

    if (storeKey !== null)
    {
      this._dbRef.child(storeKey).once('value').then(snapshot =>
      {
        if (snapshot.exists() === true)
        {
          this._key = snapshot.key;
          this._name = snapshot.val().name;
        }
      });
    }
  }
}

export default User;
