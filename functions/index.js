'use strict';
const functions = require('firebase-functions');

/**
 * Removes lobby if last player left.
 */
exports.removeLobbyOnNonePlayers = functions.database.ref('/lobbies/{lobbyId}/players').onWrite((event) =>
{
  if (event.data.exists() === false)
  {
    return event.data.ref.parent.remove()
      .then(() =>
      {
        console.log(`Lobby '${event.params.lobbyId} has been deleted`);
      })
      .catch((error) =>
      {
        console.log(console.log('Remove failed: ' + error.message));
      });
  }
});

/**
 * Changes lobby's owner if current owner left.
 */
exports.changeLobbyOnwerOnOwnerDisconnect = functions.database.ref('/lobbies/{lobbyId}').onWrite((event) =>
{
  if (event.data.exists() === true && event.data.val().players)
  {
    let data = event.data.val();

    if (event.data.child(`players/${data.owner}`).exists() === false)
    {
      let firstPlayer = Object.keys(data.players)[0];

      return event.data.ref.update({owner: firstPlayer}, () =>
      {
        console.log(`Owner of Lobby '${event.params.lobbyId}' has been changed!`);
      });
    }
  }
});
