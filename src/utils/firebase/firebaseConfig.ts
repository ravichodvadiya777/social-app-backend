import firebase from "firebase/compat/app";
import "firebase/compat/auth"; // Import the required Firebase services
import admin from "firebase-admin";
import serviceAccount from "./service-account.json";

const firebaseConfig = {};
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "YOUR DATABASE URL",
});
export default admin;
// module.exports = { firebase, admin };
