import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { getUserProfile } from "../services/firebaseService"
import "../styles/Navbar.css"

function Navbar() {
  const { currentUser, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (currentUser) {
      loadUserProfile()
    }
  }, [currentUser])

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(currentUser.uid)
      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${darkMode ? "dark" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          IQode
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`menu-bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`menu-bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`menu-bar ${menuOpen ? "open" : ""}`}></span>
        </div>

        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/leaderboard" className="nav-link" onClick={closeMenu}>
              Leaderboard
            </Link>
          </li>
          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-quizzes" className="nav-link" onClick={closeMenu}>
                  My Quizzes
                </Link>
              </li>
              {userProfile?.isAdmin && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                    Admin
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-link" onClick={closeMenu}>
                  Register
                </Link>
              </li>
            </>
          )}
          <li className="nav-item theme-toggle">
            <button className="theme-btn" onClick={toggleTheme}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar