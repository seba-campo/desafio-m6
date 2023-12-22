import firebase from "firebase"
import * as dotenv from "dotenv"

const db = firebase.initializeApp({
  apiKey: process.env.FRONTEND_RTDB_KEY,
  databaseURL: "https://desafio-m6-13481-default-rtdb.firebaseio.com/",
  authDomain: "desafio-m6-13481-default-rtdb.firebaseapp.com",
});

// apiKey: "R8vTSiU7jRESemfXG0dG0E8UmlY9cemgCOU2i0Tw",

const rtdb = firebase.database();

export { rtdb };
