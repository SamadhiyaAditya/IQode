import { Link } from "react-router-dom"
import "../styles/NotFound.css"

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-button">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound