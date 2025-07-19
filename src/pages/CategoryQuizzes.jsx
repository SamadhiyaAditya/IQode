import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"
import { getQuizQuestions } from "../services/quizService"

function CategoryQuizzes() {
  const { category } = useParams()
  const [builtInQuizzes, setBuiltInQuizzes] = useState([])
  const [communityQuizzes, setCommunityQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadQuizzes()
  }, [category])

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load built-in quizzes
      const builtInQuestions = await getQuizQuestions(category, null, 50)
      if (builtInQuestions.length > 0) {

        setBuiltInQuizzes([
          {
            id: `builtin-${category}`,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Quiz`,
            description: `Test your knowledge of ${category} with our comprehensive built-in quiz.`,
            category: category,
            difficulty: "mixed",
            questionCount: builtInQuestions.length,
            timeLimit: 10,
            type: "builtin",
            tags: ["built-in", category],
          },
        ])
      }

      // Load community quizzes
      const q = query(
        collection(db, "userQuizzes"),
        where("category", "==", category),
        where("status", "==", "approved"),
        where("isActive", "!=", false),
      )

      const querySnapshot = await getDocs(q)
      const communityQuizList = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        communityQuizList.push({
          id: doc.id,
          ...data,
          type: "community",
          questionCount: data.questions?.length || 0,
        })
      })

      setCommunityQuizzes(communityQuizList)
    } catch (err) {
      console.error("Error loading quizzes:", err)
      setError("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#28a745"
      case "medium":
        return "#ffc107"
      case "hard":
        return "#dc3545"
      default:
        return "#4a6bff"
    }
  }

  const formatCategoryName = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/[/_]/g, " ")
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div className="loader"></div>
        <p>Loading {formatCategoryName(category)} quizzes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2 style={{ color: "#dc3545" }}>Error</h2>
        <p>{error}</p>
        <Link to="/" style={{ color: "#4a6bff", textDecoration: "none" }}>
          Go Back Home
        </Link>
      </div>
    )
  }

  const allQuizzes = [...builtInQuizzes, ...communityQuizzes]

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#4a6bff", fontSize: "2.5rem", marginBottom: "10px" }}>
          {formatCategoryName(category)} Quizzes
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          Choose from our collection of {category} quizzes to test your knowledge
        </p>
      </div>

      {allQuizzes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ color: "#333", marginBottom: "15px" }}>No Quizzes Available</h3>
          <p style={{ color: "#666", marginBottom: "25px" }}>
            There are no quizzes available for {formatCategoryName(category)} at the moment.
          </p>
          <Link
            to="/"
            style={{
              backgroundColor: "#4a6bff",
              color: "white",
              padding: "12px 25px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Browse Other Categories
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "25px",
          }}
        >
          {allQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                border: "1px solid #e1e4e8",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <h3
                  style={{
                    margin: "0",
                    color: "#333",
                    fontSize: "1.3rem",
                    flex: "1",
                    marginRight: "15px",
                  }}
                >
                  {quiz.title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span
                    style={{
                      backgroundColor: "#4a6bff",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    {quiz.type === "builtin" ? "Built-in" : "Community"}
                  </span>
                  {quiz.difficulty !== "mixed" && (
                    <span
                      style={{
                        backgroundColor: getDifficultyColor(quiz.difficulty),
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      {quiz.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "15px" }}>{quiz.description}</p>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "15px",
                    fontSize: "0.9rem",
                    color: "#666",
                  }}
                >
                  <span>{quiz.questionCount} questions</span>
                  {quiz.timeLimit && <span>{quiz.timeLimit} minutes</span>}
                </div>

                {quiz.tags && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {quiz.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "#f5f7fa",
                          color: "#333",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          border: "1px solid #e1e4e8",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {quiz.tags.length > 3 && (
                      <span
                        style={{
                          backgroundColor: "#f5f7fa",
                          color: "#333",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          border: "1px solid #e1e4e8",
                        }}
                      >
                        +{quiz.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link
                  to={quiz.type === "builtin" ? `/quiz/${category}` : `/custom-quiz/${quiz.id}`}
                  style={{
                    backgroundColor: "#4a6bff",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3a5bef"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4a6bff"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  Take Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryQuizzes