// firebaseConfig.js

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const firebaseConfig = {
  apiKey: "AIzaSyDUX5KOpXt4ai6Kd4b38XmrJgLEch_o_YY",
  authDomain: "kalpavriksh-app.firebaseapp.com",
  projectId: "kalpavriksh-app",
  storageBucket: "kalpavriksh-app.appspot.com",
  messagingSenderId: "785897566888",
  appId: "1:785897566888:web:d469e9c353688f30fb489d",
};

// module.exports = firebaseConfig;

// admin.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  ...firebaseConfig,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
