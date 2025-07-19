"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { QuizProvider } from "./contexts/QuizContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Quiz from "./pages/Quiz"
import CustomQuiz from "./pages/CustomQuiz"
import CategoryQuizzes from "./pages/CategoryQuizzes"
import Results from "./pages/Results"
import Profile from "./pages/Profile"
import Leaderboard from "./pages/Leaderboard"
import MyQuizzes from "./pages/MyQuizzes"
import AdminPanel from "./components/AdminPanel"
import NotFound from "./pages/NotFound"
import { useState, useEffect } from "react"
import { getUserProfile } from "./services/firebaseService"
import "./styles/App.css"

// Secure route component
const SecureRoute = ({ children }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return children
}

// Admin route component
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      getUserProfile(currentUser.uid)
        .then((profile) => {
          setUserProfile(profile)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [currentUser])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!currentUser || !userProfile?.isAdmin) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <QuizProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/category/:category" element={<CategoryQuizzes />} />
                  <Route path="/quiz/:category" element={<Quiz />} />
                  <Route path="/custom-quiz/:quizId" element={<CustomQuiz />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route
                    path="/profile"
                    element={
                      <SecureRoute>
                        <Profile />
                      </SecureRoute>
                    }
                  />
                  <Route
                    path="/my-quizzes"
                    element={
                      <SecureRoute>
                        <MyQuizzes />
                      </SecureRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </QuizProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App