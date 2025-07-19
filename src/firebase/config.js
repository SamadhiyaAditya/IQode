import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAgfw1tKisDshfNxa6G3CWqDxrhMBmc2_0",
  authDomain: "iqode-2862f.firebaseapp.com",
  projectId: "iqode-2862f",
  storageBucket: "iqode-2862f.firebasestorage.app",
  messagingSenderId: "774032100467",
  appId: "1:774032100467:web:bba3274965842f5b9d2e06"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }