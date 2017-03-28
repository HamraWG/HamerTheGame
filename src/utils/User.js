class User
{
  constructor (database)
  {
    this._db = database;
    this._dbRef = 'users';
    this._fbUserStorageRef = 'firebase.user';

    this._key = null;
    this._name = null;

    this.getIfExists();
  }

  get key ()
  {
    return this._key;
  }

  get name ()
  {
    return this._name;
  }

  set name (name)
  {
    if (name === undefined) throw new TypeError('`name` cannot be undefined');

    // TODO(Ivan): Check if user exists

    this._db.ref(`${this._dbRef}/${this._key}`).set({
      name: name.toString()
    });
  }

  create (name)
  {
    if (name === undefined) throw new TypeError('`name` cannot be undefined');
    // TODO(Ivan): Check if user exists properly
    if (this._key !== null) return false;

    let user = this._db.ref(this._dbRef).push({
      name: name.toString()
    });

    this._key = user.key;
    localStorage.setItem(this._fbUserStorageRef, this._key);
    return true;
  }

  getIfExists ()
  {
    let key = localStorage.getItem(this._fbUserStorageRef);
    if (key === null) return false;

    this._db.ref(`${this._dbRef}/${key}`).once('value').then(snapshot =>
    {
      if (snapshot.val() === null) return false;

      this._key = snapshot.val().name;
      return true;
    });
  }
}

export default User;
