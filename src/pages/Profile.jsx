import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { getUserProfile, updateUserProfile, uploadFile } from "../services/firebaseService"
import "../styles/Profile.css"

function Profile() {
  const { currentUser } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    location: "",
    website: "",
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile()
    }
  }, [currentUser])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const profile = await getUserProfile(currentUser.uid)
      setUserProfile(profile)
      setEditForm({
        username: profile?.username || "",
        bio: profile?.bio || "",
        location: profile?.location || "",
        website: profile?.website || "",
      })
    } catch (err) {
      setError("Failed to load user profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateUserProfile(currentUser.uid, editForm)
      await fetchUserProfile()
      setEditing(false)
    } catch (err) {
      setError("Failed to update profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const avatarUrl = await uploadFile(file, `avatars/${currentUser.uid}`)
      await updateUserProfile(currentUser.uid, { avatar: avatarUrl })
      await fetchUserProfile()
    } catch (err) {
      setError("Failed to upload avatar")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const calculateLevel = (experience) => {
    return Math.floor((experience || 0) / 100) + 1
  }

  const getExperienceForNextLevel = (experience) => {
    const currentLevel = calculateLevel(experience)
    return currentLevel * 100 - (experience || 0)
  }

  const calculateAverageScore = () => {
    if (!userProfile?.scores || userProfile.scores.length === 0) return 0
    const totalPercentage = userProfile.scores.reduce((sum, score) => {
      return sum + (score.score / score.totalQuestions) * 100
    }, 0)
    return Math.round(totalPercentage / userProfile.scores.length)
  }

  if (loading && !userProfile) {
    return (
      <div className="profile-loading">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error && !userProfile) {
    return (
      <div className="profile-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchUserProfile}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        {!editing && (
          <button className="edit-profile-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-info">
              <div className="avatar-section">
                <div className="profile-avatar">
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar || "/placeholder.svg"} alt="Profile" />
                  ) : (
                    <span>{userProfile?.username?.charAt(0) || currentUser.email.charAt(0)}</span>
                  )}
                  {editing && (
                    <div className="avatar-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload" className="upload-btn">
                        {uploading ? "Uploading..." : "Change"}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Where are you from?"
                    />
                  </div>

                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setEditing(false)} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className="save-btn">
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <h3>{userProfile?.username || "User"}</h3>
                  <p className="email">{currentUser.email}</p>
                  {userProfile?.bio && <p className="bio">{userProfile.bio}</p>}
                  {userProfile?.location && (
                    <p className="location">
                      <span className="icon">📍</span>
                      {userProfile.location}
                    </p>
                  )}
                  {userProfile?.website && (
                    <p className="website">
                      <span className="icon">🌐</span>
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                        {userProfile.website}
                      </a>
                    </p>
                  )}
                  <p className="join-date">
                    <span className="icon">📅</span>
                    Joined {new Date(userProfile?.createdAt?.toDate?.() || userProfile?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-value">{userProfile?.totalScore || 0}</div>
                <div className="stat-label">Total Score</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{userProfile?.quizzesTaken || 0}</div>
                <div className="stat-label">Quizzes Taken</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{calculateLevel(userProfile?.experience)}</div>
                <div className="stat-label">Level</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{calculateAverageScore()}%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>

            <div className="level-progress">
              <div className="level-info">
                <span>Level {calculateLevel(userProfile?.experience)}</span>
                <span>{getExperienceForNextLevel(userProfile?.experience)} XP to next level</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${((userProfile?.experience || 0) % 100) / 10}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="quiz-history">
            <h3>Recent Quiz History</h3>
            {userProfile?.scores && userProfile.scores.length > 0 ? (
              <div className="history-list">
                {userProfile.scores
                  .slice(-10)
                  .reverse()
                  .map((score, index) => (
                    <div key={index} className="history-item">
                      <div className="history-info">
                        <div className="history-category">{score.category}</div>
                        <div className="history-date">{new Date(score.date).toLocaleDateString()}</div>
                      </div>
                      <div className="history-score">
                        {score.score}/{score.totalQuestions} ({Math.round((score.score / score.totalQuestions) * 100)}%)
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-history">
                <p>No quiz history yet. Take your first quiz to see your progress!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
