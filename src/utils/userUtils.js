import { getUserProfile as getFirebaseUserProfile } from "../services/firebaseService"

export const getUserProfile = async (userId) => {
  try {
    return await getFirebaseUserProfile(userId)
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

export const formatUserLevel = (experience) => {
  return Math.floor((experience || 0) / 100) + 1
}

export const getExperienceForNextLevel = (experience) => {
  const currentLevel = formatUserLevel(experience)
  return currentLevel * 100 - (experience || 0)
}

export const calculateProgress = (current, total) => {
  if (!total || total === 0) return 0
  return Math.min((current / total) * 100, 100)
}

export const formatScore = (score) => {
  if (!score) return "0"
  if (score >= 1000000) {
    return (score / 1000000).toFixed(1) + "M"
  }
  if (score >= 100) {
    return (score / 100).toFixed(1) + "K"
  }
  return score.toString()
}

export const formatDate = (date) => {
  if (!date) return "N/A"

  if (date.toDate) {
    // Firestore timestamp
    return date.toDate().toLocaleDateString()
  }

  if (typeof date === "string") {
    return new Date(date).toLocaleDateString()
  }

  return date.toLocaleDateString()
}

export const formatTimeAgo = (date) => {
  if (!date) return "N/A"

  const now = new Date()
  const past = date.toDate ? date.toDate() : new Date(date)
  const diffInSeconds = Math.floor((now - past) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return past.toLocaleDateString()
}
