import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    addDoc,
    increment,
    serverTimestamp,
    arrayUnion,
  } from "firebase/firestore"
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
  import { db, storage } from "../firebase/config"
  
  // User
  export const createUserProfile = async (userId, userData) => {
    try {
      await setDoc(doc(db, "users", userId), {
        ...userData,
        createdAt: serverTimestamp(),
        totalScore: 0,
        quizzesTaken: 0,
        level: 1,
        experience: 0,
        isAdmin: false,
        isActive: true,
        scores: [],
      })
    } catch (error) {
      console.error("Error creating user profile:", error)
      throw error
    }
  }
  
  export const getUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null
    } catch (error) {
      console.error("Error getting user profile:", error)
      throw error
    }
  }
  
  export const updateUserProfile = async (userId, updates) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        ...updates,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }
  
  export const saveQuizResult = async (userId, quizData) => {
    try {
      console.log("Saving quiz result:", { userId, quizData })
  
      // Save the quiz result
      const resultId = await addDoc(collection(db, "quizResults"), {
        userId,
        ...quizData,
        timestamp: serverTimestamp(),
      })
  
      // Calculate points (score * 10 for experience)
      const experiencePoints = quizData.score * 10
      const percentage = Math.round((quizData.score / quizData.totalQuestions) * 100)
  
      // score for user profile
      const scoreEntry = {
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        percentage: percentage,
        category: quizData.category,
        date: new Date().toISOString(),
        quizId: quizData.quizId || null,
        isCustomQuiz: quizData.isCustomQuiz || false,
      }
  
      // Update user stats
      await updateDoc(doc(db, "users", userId), {
        totalScore: increment(quizData.score),
        quizzesTaken: increment(1),
        experience: increment(experiencePoints),
        lastQuizDate: serverTimestamp(),
        scores: arrayUnion(scoreEntry),
      })
  
      console.log("Quiz result saved successfully")
      return resultId.id
    } catch (error) {
      console.error("Error saving quiz result:", error)
      throw error
    }
  }
  
  // User-Generated Quizzes
  export const submitQuizForApproval = async (userId, quizData) => {
    try {
      const quizId = await addDoc(collection(db, "userQuizzes"), {
        createdBy: userId,
        ...quizData,
        status: "pending",
        createdAt: serverTimestamp(),
        approvedBy: null,
        approvedAt: null,
        isActive: false,
      })
  
      return quizId.id
    } catch (error) {
      console.error("Error submitting quiz for approval:", error)
      throw error
    }
  }
  
  export const getPendingQuizzes = async () => {
    try {
      const q = query(collection(db, "userQuizzes"), where("status", "==", "pending"), orderBy("createdAt", "desc"))
  
      const querySnapshot = await getDocs(q)
      const quizzes = []
  
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() })
      })
  
      return quizzes
    } catch (error) {
      console.error("Error getting pending quizzes:", error)
      throw error
    }
  }
  
  export const approveQuiz = async (quizId, adminId) => {
    try {
      await updateDoc(doc(db, "userQuizzes", quizId), {
        status: "approved",
        approvedBy: adminId,
        approvedAt: serverTimestamp(),
        isActive: true,
      })
    } catch (error) {
      console.error("Error approving quiz:", error)
      throw error
    }
  }
  
  export const rejectQuiz = async (quizId, adminId, reason) => {
    try {
      await updateDoc(doc(db, "userQuizzes", quizId), {
        status: "rejected",
        rejectedBy: adminId,
        rejectedAt: serverTimestamp(),
        rejectionReason: reason,
      })
    } catch (error) {
      console.error("Error rejecting quiz:", error)
      throw error
    }
  }
  
  // File Upload
  export const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }
  