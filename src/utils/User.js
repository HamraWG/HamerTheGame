/**
 * Class representing a User.
 */
class User
{
  /**
   * Creates user instance
   *
   * @param {Firbase.Database} database The firebase database
   */
  constructor (database)
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
   * @returns {String|null}
   */
  get key ()
  {
    return this._key;
  }

  /**
   * Gets user name.
   *
   * @returns {String|null}
   */
  get name ()
  {
    return this._name;
  }

  /**
   * Set user name.
   *
   * @param {String|null} name
   */
  set name (name)
  {
    if (typeof name !== 'string') throw new TypeError('name must be a non-empty string.');

    this._dbRef.child(this._key).set({
      name: name.toString()
    });
  }

  /**
   * Gets or create database key.
   *
   * @returns {undefined}
   */
  getOrCreateDbKey ()
  {
    let storeKey = localStorage.getItem(this._dbKeyStorageRef);

    if (storeKey)
    {
      this._dbRef.child(storeKey).once('value').then(snapshot =>
      {
        if (snapshot.exists() === false)
        {
          this.createNewKey();
        }
        else
        {
          this._key = snapshot.key;
          this._name = snapshot.val().name;
        }
      });
    }
  }

  /**
   * Creates new user in database and push reference key into localStorage.
   *
   * @returns {User}
   */
  createNewKey ()
  {
    this._key = this._dbRef.push().key;
    localStorage.setItem(this._dbKeyStorageRef, this._key);

    return this;
  }
}

export default User;
