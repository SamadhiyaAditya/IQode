import { Link } from "react-router-dom"
import "../styles/CategoryCard.css"

function CategoryCard({ category, description, icon, difficulty }) {
  return (
    <Link to={`/quiz/${category.toLowerCase()}`} className="category-card">
      <div className="category-icon">{icon}</div>
      <h3 className="category-title">{category}</h3>
      <p className="category-description">{description}</p>
      <div className="category-difficulty">
        <span>Difficulty: </span>
        <span className={`difficulty-${difficulty.toLowerCase()}`}>{difficulty}</span>
      </div>
    </Link>
  )
}

export default CategoryCard