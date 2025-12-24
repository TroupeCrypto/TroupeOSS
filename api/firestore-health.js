import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getDb() {
  const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  if (!getApps().length) {
    initializeApp({
      credential: cert(creds),
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
  }

  return getFirestore(undefined, process.env.FIRESTORE_DATABASE_ID);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  try {
    const db = getDb();
    const ref = db.collection("indexes").doc("policy");

    await ref.set(
      {
        version: "v1",
        initializedAt: new Date().toISOString(),
        database: process.env.FIRESTORE_DATABASE_ID,
      },
      { merge: true }
    );

    const snap = await ref.get();

    res.status(200).json({
      ok: true,
      database: process.env.FIRESTORE_DATABASE_ID,
      data: snap.data(),
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: String(err.message || err),
    });
  }
}
