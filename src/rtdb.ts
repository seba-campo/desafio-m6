import firebase from "firebase"

const db = firebase.initializeApp({
  apiKey: "R8vTSiU7jRESemfXG0dG0E8UmlY9cemgCOU2i0Tw",
  databaseURL: "https://desafio-m6-13481-default-rtdb.firebaseio.com/",
  authDomain: "desafio-m6-13481-default-rtdb.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
