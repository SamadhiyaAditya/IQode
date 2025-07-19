"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getAllCategories, getQuizQuestions } from "../services/quizService"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"
import "../styles/Home.css"

function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [approvedQuizzes, setApprovedQuizzes] = useState([])
  const [allBuiltInQuestions, setAllBuiltInQuestions] = useState([])

  useEffect(() => {
    loadCategories()
    loadApprovedQuizzes()
    loadAllBuiltInQuestions()
  }, [])

  // Real-time search as user types
  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchTerm])

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const loadApprovedQuizzes = async () => {
    try {
      const q = query(collection(db, "userQuizzes"), where("status", "==", "approved"), where("isActive", "!=", false))
      const querySnapshot = await getDocs(q)
      const quizzes = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        quizzes.push({ id: doc.id, ...data, type: "custom" })
      })

      setApprovedQuizzes(quizzes)
    } catch (error) {
      console.error("Error loading approved quizzes:", error)
    }
  }

  const loadAllBuiltInQuestions = async () => {
    try {
      const allQuestions = []
      const categoryNames = ["javascript", "react", "htmlcss", "dsa", "backend", "coding"]

      for (const category of categoryNames) {
        try {
          const questions = await getQuizQuestions(category, null, 50)
          questions.forEach((question) => {
            allQuestions.push({
              ...question,
              category,
              type: "builtin",
            })
          })
        } catch (error) {
          console.error(`Error loading ${category} questions:`, error)
        }
      }

      setAllBuiltInQuestions(allQuestions)
    } catch (error) {
      console.error("Error loading built-in questions:", error)
    }
  }

  const performSearch = async (term) => {
    try {
      setLoading(true)
      const searchTerm = term.toLowerCase()
      const results = []

      // Search in approved user-created quizzes
      const customQuizResults = approvedQuizzes.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm) ||
          quiz.description?.toLowerCase().includes(searchTerm) ||
          quiz.category.toLowerCase().includes(searchTerm) ||
          quiz.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
      )

      // Search in built-in questions
      const builtInResults = allBuiltInQuestions.filter(
        (question) =>
          question.text.toLowerCase().includes(searchTerm) ||
          question.category.toLowerCase().includes(searchTerm) ||
          question.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
      )

      // Group built-in questions by category for display
      const groupedBuiltIn = {}
      builtInResults.forEach((question) => {
        if (!groupedBuiltIn[question.category]) {
          groupedBuiltIn[question.category] = {
            id: `builtin-${question.category}`,
            title: `${question.category.charAt(0).toUpperCase() + question.category.slice(1)} Questions`,
            description: `Built-in ${question.category} questions matching your search`,
            category: question.category,
            type: "builtin",
            questionCount: 0,
            matchingQuestions: [],
          }
        }
        groupedBuiltIn[question.category].questionCount++
        groupedBuiltIn[question.category].matchingQuestions.push(question)
      })

      results.push(...customQuizResults)
      results.push(...Object.values(groupedBuiltIn))

      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error("Error searching:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const groupQuizzesByCategory = () => {
    const grouped = {}
    approvedQuizzes.forEach((quiz) => {
      if (!grouped[quiz.category]) {
        grouped[quiz.category] = []
      }
      grouped[quiz.category].push(quiz)
    })
    return grouped
  }

  const groupedQuizzes = groupQuizzesByCategory()

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Browse Quizzes</h1>
        <p>Discover and search through our collection of technical quizzes</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search quizzes, topics, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {loading && <div className="search-loading">Searching...</div>}
        </div>
      </div>

      {showResults && (
        <div className="search-results">
          <h2>Search Results ({searchResults.length})</h2>

          {searchResults.length === 0 ? (
            <div className="no-results">
              <p>No quizzes found matching "{searchTerm}".</p>
              <p>Try different keywords or browse categories below.</p>
            </div>
          ) : (
            <div className="results-grid">
              {searchResults.map((result) => (
                <div key={result.id} className="quiz-result-card">
                  <div className="quiz-card-header">
                    <h3>{result.title}</h3>
                    <div className="quiz-badges">
                      <span className="category-badge">{result.category}</span>
                      {result.difficulty && (
                        <span className={`difficulty-badge ${result.difficulty}`}>{result.difficulty}</span>
                      )}
                      <span className="type-badge">{result.type === "custom" ? "Community" : "Built-in"}</span>
                    </div>
                  </div>

                  <div className="quiz-card-content">
                    <p className="quiz-description">{result.description}</p>

                    <div className="quiz-stats">
                      {result.type === "custom" ? (
                        <>
                          <span>{result.questions?.length || 0} questions</span>
                          {result.timeLimit && <span>{result.timeLimit} minutes</span>}
                        </>
                      ) : (
                        <span>{result.questionCount} matching questions</span>
                      )}
                    </div>

                    {result.tags && (
                      <div className="quiz-tags">
                        {result.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                        {result.tags.length > 3 && <span className="tag">+{result.tags.length - 3} more</span>}
                      </div>
                    )}
                  </div>

                  <div className="quiz-card-actions">
                    {result.type === "custom" ? (
                      <Link to={`/custom-quiz/${result.id}`} className="take-quiz-btn">
                        Take Quiz
                      </Link>
                    ) : (
                      <Link to={`/quiz/${result.category}`} className="take-quiz-btn">
                        Take Quiz
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showResults && (
        <div className="categories-section">
          <h2>Browse by Category</h2>

          {/* Default Categories */}
          <div className="categories-grid">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-stats">
                  {groupedQuizzes[category.id] && <span>{groupedQuizzes[category.id].length} community quizzes</span>}
                  {!groupedQuizzes[category.id] && <span>No community quizzes yet</span>}
                </div>
              </Link>
            ))}
          </div>

          {/* Community Quizzes by Category */}
          {Object.keys(groupedQuizzes).length > 0 && (
            <div className="community-quizzes-section">
              <h2>Community Quizzes</h2>
              {Object.entries(groupedQuizzes).map(([category, quizzes]) => (
                <div key={category} className="category-section">
                  <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Quizzes</h3>
                  <div className="quiz-cards-grid">
                    {quizzes.map((quiz) => (
                      <div key={quiz.id} className="community-quiz-card">
                        <h4>{quiz.title}</h4>
                        <p>{quiz.description}</p>
                        <div className="quiz-info">
                          <span>{quiz.questions?.length || 0} questions</span>
                          <span className={`difficulty ${quiz.difficulty}`}>{quiz.difficulty}</span>
                          {quiz.timeLimit && <span>{quiz.timeLimit} min</span>}
                        </div>
                        <Link to={`/custom-quiz/${quiz.id}`} className="quiz-link">
                          Take Quiz →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home