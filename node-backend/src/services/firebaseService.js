const admin = require('firebase-admin');
const serviceAccount = require('C:/Users/natas/Downloads/funcionarios-c87c2-firebase-adminsdk-fbsvc-d1808f47b4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = {admin, db, auth};
