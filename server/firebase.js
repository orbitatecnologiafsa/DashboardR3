// firebase.js

const admin = require('firebase-admin');

// Substitua pelo caminho para o seu arquivo de chave privada do Firebase
const serviceAccount = require('./prototiposincronizador-firebase-adminsdk-dtshh-58f592890f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db; 