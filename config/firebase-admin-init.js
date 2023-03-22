const admin = require('firebase-admin');

// Initialisez Firebase Admin SDK
const serviceAccount = require('../serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://asm-v2-1.appspot.com'
});

module.exports = admin;
