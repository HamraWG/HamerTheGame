'use strict';

import {database} from '../utils';

/**
 * Class representing a CreateGameListener.
 */
class CreateGameListener
{
  /**
   * Creates CreateGameListener instance.
   *
   * @param {string} gameId Id that has to be listening.
   */
  constructor (gameId)
  {
    this._dbRef = database.ref('games');
    this._gameId = gameId;
    this._created = false;

    this._listenGameCreate();
  }

  /**
   * Gets created game status.
   *
   * @readonly
   * @returns {boolean}
   */
  get created ()
  {
    return this._created;
  }

  /**
   * Turns on create game listener.
   *
   * @private
   */
  _listenGameCreate ()
  {
    let gameCreateListener = this._dbRef.on('child_added', (snapshot) =>
    {
      if (snapshot.key === this._gameId)
      {
        this._created = true;

        this._dbRef.off('child_added', gameCreateListener);
      }
    });
  }
}

export default CreateGameListener;
