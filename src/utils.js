'use strict';

import firebase from 'firebase';
import config from './config';

export const firebaseApp = firebase.initializeApp(config.firebase);
export const database = firebaseApp.database();

export const padNumber = (n, pad) =>
{
  let number = n.toString();

  let padZero = pad - number.length;
  for (let i = 1; i <= padZero; i++)
  {
    number = '0' + number;
  }

  return number;
};

export const escapeSpecialChars = (text) =>
{
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}