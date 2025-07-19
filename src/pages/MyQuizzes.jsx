import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import QuizCreator from "../components/QuizCreator"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "../firebase/config"
import "../styles/MyQuizzes.css"

function MyQuizzes() {
  const { currentUser } = useAuth()
  const [myQuizzes, setMyQuizzes] = useState([])
  const [showCreator, setShowCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (currentUser) {
      loadMyQuizzes()
    }
  }, [currentUser])

  const loadMyQuizzes = async () => {
    try {
      setLoading(true)
      const q = query(
        collection(db, "userQuizzes"),
        where("createdBy", "==", currentUser.uid),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(q)
      const quizzes = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        quizzes.push({ id: doc.id, ...data })
      })

      setMyQuizzes(quizzes)
    } catch (error) {
      console.error("Error loading my quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredQuizzes = () => {
    if (activeTab === "all") return myQuizzes
    return myQuizzes.filter((quiz) => quiz.status === activeTab)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success"
      case "rejected":
        return "danger"
      case "pending":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "pending":
        return "Pending Review"
      default:
        return "Unknown"
    }
  }

  const filteredQuizzes = getFilteredQuizzes()

  return (
    <div className="my-quizzes-container">
      <div className="my-quizzes-header">
        <h1>My Quizzes</h1>
        <button className="create-quiz-btn" onClick={() => setShowCreator(true)}>
          Create New Quiz
        </button>
      </div>

      <div className="quiz-tabs">
        <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          All ({myQuizzes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({myQuizzes.filter((q) => q.status === "approved").length})
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({myQuizzes.filter((q) => q.status === "pending").length})
        </button>
        <button
          className={`tab-btn ${activeTab === "rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({myQuizzes.filter((q) => q.status === "rejected").length})
        </button>
      </div>

      {loading ? (
        <div className="loading-section">
          <div className="loader"></div>
          <p>Loading your quizzes...</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="no-quizzes">
          <h3>No quizzes found</h3>
          <p>
            {activeTab === "all"
              ? "You haven't created any quizzes yet. Create your first quiz to get started!"
              : `No ${activeTab} quizzes found.`}
          </p>
          {activeTab === "all" && (
            <button className="create-first-quiz-btn" onClick={() => setShowCreator(true)}>
              Create Your First Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="quizzes-grid">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-header">
                <h3>{quiz.title}</h3>
                <span className={`status-badge ${getStatusColor(quiz.status)}`}>{getStatusText(quiz.status)}</span>
              </div>

              <div className="quiz-meta">
                <span className="category">{quiz.category}</span>
                <span className="difficulty">{quiz.difficulty}</span>
                <span className="questions-count">{quiz.questions?.length || 0} questions</span>
                {quiz.timeLimit && <span className="time-limit">{quiz.timeLimit} min</span>}
              </div>

              <div className="quiz-description">
                <p>{quiz.description}</p>
              </div>

              {quiz.tags && (
                <div className="quiz-tags">
                  {quiz.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="quiz-dates">
                <p>Created: {new Date(quiz.createdAt?.toDate()).toLocaleDateString()}</p>
                {quiz.approvedAt && <p>Approved: {new Date(quiz.approvedAt?.toDate()).toLocaleDateString()}</p>}
                {quiz.rejectedAt && (
                  <div className="rejection-info">
                    <p>Rejected: {new Date(quiz.rejectedAt?.toDate()).toLocaleDateString()}</p>
                    {quiz.rejectionReason && <p className="rejection-reason">Reason: {quiz.rejectionReason}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreator && (
        <QuizCreator
          onClose={() => setShowCreator(false)}
          onSubmit={() => {
            setShowCreator(false)
            loadMyQuizzes()
          }}
        />
      )}
    </div>
  )
}

export default MyQuizzes