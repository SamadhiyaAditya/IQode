import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Auth.css"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(email, password, username)
      navigate("/")
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use")
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak")
      } else {
        setError("Failed to create an account")
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("")
      setLoading(true)
      await signInWithGoogle()
      navigate("/")
    } catch (err) {
      setError("Failed to sign in with Google")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="google-button" onClick={handleGoogleSignIn} disabled={loading}>
          <span className="google-icon">G</span>
          Sign up with Google
        </button>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
