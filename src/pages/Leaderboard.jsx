import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import "../styles/Leaderboard.css"

function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, "users"), orderBy("totalScore", "desc"), limit(20))

        const querySnapshot = await getDocs(q)
        const leaderboardData = []

        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          leaderboardData.push({
            id: doc.id,
            username: userData.username,
            totalScore: userData.totalScore || 0,
            quizzesTaken: userData.scores?.length || 0,
          })
        })

        setUsers(leaderboardData)
      } catch (err) {
        setError("Failed to load leaderboard")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <div className="loader"></div>
        <p>Loading leaderboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <p>Top performers in technical quizzes</p>
      </div>

      <div className="leaderboard-table">
        <div className="leaderboard-row header">
          <div className="rank">Rank</div>
          <div className="username">User</div>
          <div className="score">Score</div>
          <div className="quizzes">Quizzes</div>
        </div>

        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={user.id} className={`leaderboard-row ${index < 3 ? "top-rank" : ""}`}>
              <div className="rank">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && index + 1}
              </div>
              <div className="username">
                <div className="user-avatar">{user.username.charAt(0)}</div>
                {user.username}
              </div>
              <div className="score">{user.totalScore}</div>
              <div className="quizzes">{user.quizzesTaken}</div>
            </div>
          ))
        ) : (
          <div className="no-data">No users found</div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
