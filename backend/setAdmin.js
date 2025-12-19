const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const ADMIN_EMAIL = "admin@riziq.in"; // must exist in Firebase Auth

async function setAdmin() {
  const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);

  await admin.auth().setCustomUserClaims(user.uid, {
    admin: true
  });

  console.log(`✅ Admin role assigned to ${ADMIN_EMAIL}`);
}

setAdmin().catch(console.error);