'use strict';
const functions = require('firebase-functions');

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
