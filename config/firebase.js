const {
    initializeApp,
    cert,
    getApps
} = require("firebase-admin/app");

const {
    getFirestore
} = require("firebase-admin/firestore");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT
    );
} else {
    serviceAccount = require("../serviceAccountKey.json");
}

const app = getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount)
    });

const db = getFirestore(app);

module.exports = { db };