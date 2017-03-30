class User
{
  constructor (database)
  {
    this._dbRef = database.ref('users');
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
    if (typeof name !== 'string') throw new TypeError('name must be a non-empty string.');

    this._dbRef.child(this._key).set({
      name: name.toString()
    });
  }

  create (name)
  {
    if (typeof name !== 'string') throw new TypeError('name must be a non-empty string.');
    if (this._key !== null) return false;

    let user = this._dbRef.push({
      name: name
    });

    this._key = user.key;
    localStorage.setItem(this._fbUserStorageRef, this._key);
    return true;
  }

  getIfExists ()
  {
    let key = localStorage.getItem(this._fbUserStorageRef);
    if (key === null) return false;

    this._dbRef.child(key).once('value').then(snapshot => {
      if (snapshot.val() === null) return false;
      let data = snapshot.val();

      this._key = key;
      this._name = data.name;
      return true;
    });
  }
}

export default User;
