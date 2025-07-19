import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getPendingQuizzes, approveQuiz, rejectQuiz, getUserProfile } from "../services/firebaseService"
import { collection, query, orderBy, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import "../styles/AdminPanel.css"

function AdminPanel() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("pending")
  const [pendingQuizzes, setPendingQuizzes] = useState([])
  const [requestHistory, setRequestHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    if (currentUser) {
      loadUserProfile()
    }
  }, [currentUser])

  useEffect(() => {
    if (activeTab === "pending") {
      loadPendingQuizzes()
    } else if (activeTab === "history") {
      loadRequestHistory()
    }
  }, [activeTab])

  const loadUserProfile = async () => {
    try {
      const profile = await getUserProfile(currentUser.uid)
      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const loadPendingQuizzes = async () => {
    try {
      setLoading(true)
      const quizzes = await getPendingQuizzes()
      setPendingQuizzes(quizzes)
    } catch (error) {
      console.error("Error loading pending quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRequestHistory = async () => {
    try {
      setLoading(true)
      const q = query(collection(db, "userQuizzes"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      const history = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        history.push({ id: doc.id, ...data })
      })

      setRequestHistory(history)
    } catch (error) {
      console.error("Error loading request history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveQuiz = async (quizId) => {
    try {
      await approveQuiz(quizId, currentUser.uid)
      loadPendingQuizzes()
      if (activeTab === "history") {
        loadRequestHistory()
      }
      alert("Quiz approved successfully!")
    } catch (error) {
      console.error("Error approving quiz:", error)
      alert("Failed to approve quiz")
    }
  }

  const handleRejectQuiz = async (quizId) => {
    const reason = prompt("Please provide a reason for rejection:")
    if (!reason) return

    try {
      await rejectQuiz(quizId, currentUser.uid, reason)
      loadPendingQuizzes()
      if (activeTab === "history") {
        loadRequestHistory()
      }
      alert("Quiz rejected successfully!")
    } catch (error) {
      console.error("Error rejecting quiz:", error)
      alert("Failed to reject quiz")
    }
  }

  const handleDeleteQuiz = async (quizId) => {
    const reason = prompt("Please provide a reason for deleting this approved quiz:")
    if (!reason) return

    const confirmDelete = confirm("Are you sure you want to delete this quiz? This action cannot be undone.")
    if (!confirmDelete) return

    try {
      await updateDoc(doc(db, "userQuizzes", quizId), {
        status: "deleted",
        deletedBy: currentUser.uid,
        deletedAt: serverTimestamp(),
        deletionReason: reason,
        isActive: false,
      })

      if (activeTab === "history") {
        loadRequestHistory()
      }
      alert("Quiz deleted successfully!")
    } catch (error) {
      console.error("Error deleting quiz:", error)
      alert("Failed to delete quiz")
    }
  }

  // Check admin
  if (!userProfile?.isAdmin) {
    return (
      <div className="admin-panel-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Quizzes ({pendingQuizzes.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            All Requests
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === "pending" && (
          <div className="pending-quizzes">
            <h2>Pending Quiz Approvals</h2>

            {loading ? (
              <div className="loading">Loading pending quizzes...</div>
            ) : pendingQuizzes.length === 0 ? (
              <div className="no-data">No pending quizzes to review.</div>
            ) : (
              <div className="quizzes-list">
                {pendingQuizzes.map((quiz) => (
                  <div key={quiz.id} className="quiz-card">
                    <div className="quiz-header">
                      <h3>{quiz.title}</h3>
                      <div className="quiz-meta">
                        <span className="category">{quiz.category}</span>
                        <span className="difficulty">{quiz.difficulty}</span>
                        <span className="questions-count">{quiz.questions.length} questions</span>
                        {quiz.timeLimit && <span className="time-limit">{quiz.timeLimit} min</span>}
                      </div>
                    </div>

                    <div className="quiz-description">
                      <p>{quiz.description}</p>
                    </div>

                    <div className="quiz-tags">
                      {quiz.tags?.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="quiz-questions">
                      <h4>Questions Preview:</h4>
                      {quiz.questions.slice(0, 3).map((question, index) => (
                        <div key={index} className="question-preview">
                          <p>
                            <strong>Q{index + 1}:</strong> {question.text}
                          </p>
                          <p>
                            <strong>Correct Answer:</strong> {question.correctAnswer}
                          </p>
                        </div>
                      ))}
                      {quiz.questions.length > 3 && <p>... and {quiz.questions.length - 3} more questions</p>}
                    </div>

                    <div className="quiz-actions">
                      <button className="approve-btn" onClick={() => handleApproveQuiz(quiz.id)}>
                        Approve
                      </button>
                      <button className="reject-btn" onClick={() => handleRejectQuiz(quiz.id)}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="request-history">
            <h2>All Quiz Requests</h2>

            {loading ? (
              <div className="loading">Loading request history...</div>
            ) : requestHistory.length === 0 ? (
              <div className="no-data">No quiz requests found.</div>
            ) : (
              <div className="history-list">
                {requestHistory.map((quiz) => (
                  <div key={quiz.id} className={`history-item ${quiz.status}`}>
                    <div className="history-header">
                      <h4>{quiz.title}</h4>
                      <div className="status-actions">
                        <span className={`status-badge ${quiz.status}`}>
                          {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                        </span>
                        {quiz.status === "approved" && (
                          <button className="delete-btn" onClick={() => handleDeleteQuiz(quiz.id)}>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="history-meta">
                      <span>Category: {quiz.category}</span>
                      <span>Questions: {quiz.questions?.length || 0}</span>
                      <span>Created: {new Date(quiz.createdAt?.toDate()).toLocaleDateString()}</span>
                    </div>
                    {quiz.status === "approved" && quiz.approvedAt && (
                      <p className="approval-info">
                        Approved on {new Date(quiz.approvedAt?.toDate()).toLocaleDateString()}
                      </p>
                    )}
                    {quiz.status === "rejected" && quiz.rejectedAt && (
                      <div className="rejection-info">
                        <p>Rejected on {new Date(quiz.rejectedAt?.toDate()).toLocaleDateString()}</p>
                        {quiz.rejectionReason && <p className="rejection-reason">Reason: {quiz.rejectionReason}</p>}
                      </div>
                    )}
                    {quiz.status === "deleted" && quiz.deletedAt && (
                      <div className="deletion-info">
                        <p>Deleted on {new Date(quiz.deletedAt?.toDate()).toLocaleDateString()}</p>
                        {quiz.deletionReason && <p className="deletion-reason">Reason: {quiz.deletionReason}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel