import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth, db } from "../firebase/config"
import { doc, setDoc, getDoc } from "firebase/firestore"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, username) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Create user profile in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      email,
      createdAt: new Date().toISOString(),
      isAdmin: false,
      isActive: true,
    })
    return userCredential
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", result.user.uid))

    // If not, create a new user profile
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", result.user.uid), {
        username: result.user.displayName || "User",
        email: result.user.email,
        createdAt: new Date().toISOString(),
        isAdmin: false,
        isActive: true,
      })
    }

    return result
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
