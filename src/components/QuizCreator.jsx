import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { submitQuizForApproval } from "../services/firebaseService"
import "../styles/QuizCreator.css"

function QuizCreator({ onClose, onSubmit }) {
  const { currentUser } = useAuth()
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
    timeLimit: 10, 
    tags: [],
    questions: [],
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    type: "multiple-choice",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tagInput, setTagInput] = useState("")

  const categories = [
    "javascript",
    "react",
    "htmlcss",
    "dsa",
    "backend",
    "python",
    "devops",
    "cloud",
    "mobile",
    "database",
  ]

  const handleQuizDataChange = (field, value) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = value
    setCurrentQuestion((prev) => ({
      ...prev,
      options: newOptions,
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !quizData.tags.includes(tagInput.trim())) {
      setQuizData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    setQuizData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      setError("Please enter a question text")
      return
    }

    if (currentQuestion.type === "multiple-choice") {
      if (currentQuestion.options.some((opt) => !opt.trim())) {
        setError("Please fill in all answer options")
        return
      }
      if (!currentQuestion.correctAnswer) {
        setError("Please select the correct answer")
        return
      }
    } else if (currentQuestion.type === "true-false") {
      if (!currentQuestion.correctAnswer) {
        setError("Please select the correct answer")
        return
      }
    }

    // Add question
    const newQuestion = {
      ...currentQuestion,
      id: Date.now(),
      options: currentQuestion.type === "true-false" ? ["True", "False"] : currentQuestion.options,
    }

    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))

    // Reset form
    setCurrentQuestion({
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      type: "multiple-choice",
    })
    setError("")
  }

  const removeQuestion = (questionId) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!quizData.title.trim()) {
      setError("Please enter a quiz title")
      return
    }
    if (!quizData.category) {
      setError("Please select a category")
      return
    }
    if (quizData.questions.length === 0) {
      setError("Please add at least one question")
      return
    }

    try {
      setLoading(true)
      setError("")

      console.log("Submitting quiz:", quizData)
      await submitQuizForApproval(currentUser.uid, quizData)

      alert("Quiz submitted for approval! You'll be notified once it's reviewed.")

      if (onSubmit) {
        onSubmit()
      }
      onClose()
    } catch (err) {
      console.error("Error submitting quiz:", err)
      setError("Failed to submit quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Check if form can be submitted
  const canSubmit = quizData.title.trim() && quizData.category && quizData.questions.length > 0

  return (
    <div className="quiz-creator-overlay">
      <div className="quiz-creator-container">
        <div className="quiz-creator-header">
          <h2>Create New Quiz</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="quiz-creator-form">
          <div className="quiz-info-section">
            <h3>Quiz Information</h3>

            <div className="form-group">
              <label>Quiz Title *</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => handleQuizDataChange("title", e.target.value)}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={quizData.description}
                onChange={(e) => handleQuizDataChange("description", e.target.value)}
                placeholder="Describe your quiz"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={quizData.category}
                  onChange={(e) => handleQuizDataChange("category", e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={quizData.difficulty}
                  onChange={(e) => handleQuizDataChange("difficulty", e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Time Limit (minutes)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={quizData.timeLimit}
                onChange={(e) => handleQuizDataChange("timeLimit", Number.parseInt(e.target.value) || 10)}
                placeholder="10"
              />
            </div>

            <div className="form-group">
              <label>Tags</label>
              <div className="tags-input">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <button type="button" onClick={addTag}>
                  Add
                </button>
              </div>
              <div className="tags-list">
                {quizData.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="questions-section">
            <h3>Questions ({quizData.questions.length})</h3>

            <div className="current-question">
              <h4>Add New Question</h4>

              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  value={currentQuestion.text}
                  onChange={(e) => handleQuestionChange("text", e.target.value)}
                  placeholder="Enter your question"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Question Type</label>
                <select value={currentQuestion.type} onChange={(e) => handleQuestionChange("type", e.target.value)}>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="true-false">True/False</option>
                </select>
              </div>

              {currentQuestion.type === "multiple-choice" && (
                <div className="options-section">
                  <label>Answer Options *</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="option-input">
                      <span>{String.fromCharCode(65 + index)}</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group">
                <label>Correct Answer *</label>
                {currentQuestion.type === "multiple-choice" ? (
                  <select
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => handleQuestionChange("correctAnswer", e.target.value)}
                    required
                  >
                    <option value="">Select correct answer</option>
                    {currentQuestion.options.map((option, index) => (
                      <option key={index} value={option} disabled={!option.trim()}>
                        {String.fromCharCode(65 + index)}: {option || "Enter option first"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={currentQuestion.correctAnswer}
                    onChange={(e) => handleQuestionChange("correctAnswer", e.target.value)}
                    required
                  >
                    <option value="">Select correct answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                )}
              </div>

              <div className="form-group">
                <label>Explanation (Optional)</label>
                <textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => handleQuestionChange("explanation", e.target.value)}
                  placeholder="Explain why this is the correct answer"
                  rows="2"
                />
              </div>

              <button type="button" className="add-question-btn" onClick={addQuestion}>
                Add Question
              </button>
            </div>

            {quizData.questions.length > 0 && (
              <div className="questions-list">
                <h4>Added Questions:</h4>
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <span>Question {index + 1}</span>
                      <button type="button" onClick={() => removeQuestion(question.id)}>
                        Remove
                      </button>
                    </div>
                    <p>
                      <strong>Q:</strong> {question.text}
                    </p>
                    <p>
                      <strong>Correct Answer:</strong> {question.correctAnswer}
                    </p>
                    {question.explanation && (
                      <p>
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading || !canSubmit}>
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuizCreator
