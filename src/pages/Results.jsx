import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuiz } from "../contexts/QuizContext"
import { useAuth } from "../contexts/AuthContext"
import QuestionCard from "../components/QuestionCard"
import { saveQuizResult } from "../services/firebaseService"
import "../styles/Results.css"

function Results() {
  const { questions, score, answers, currentCategory, quizFinished, resetQuiz, quizId, isCustomQuiz } = useQuiz()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!quizFinished && questions.length === 0) {
      navigate("/")
      return
    }
    if (currentUser && quizFinished && !saved && !saving) {
      saveResult()
    }
  }, [quizFinished, questions, navigate, currentUser, saved, saving])

  const saveResult = async () => {
    try {
      setSaving(true)
      console.log("Saving quiz result...")

      const quizData = {
        category: currentCategory,
        score: score,
        totalQuestions: questions.length,
        answers: answers,
        quizId: quizId,
        isCustomQuiz: isCustomQuiz,
        completedAt: new Date().toISOString(),
      }

      await saveQuizResult(currentUser.uid, quizData)
      setSaved(true)
      console.log("Quiz result saved successfully")
    } catch (error) {
      console.error("Error saving quiz result:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleTryAgain = () => {
    resetQuiz()
    if (isCustomQuiz && quizId) {
      navigate(`/custom-quiz/${quizId}`)
    } else {
      navigate(`/quiz/${currentCategory.toLowerCase()}`)
    }
  }

  const handleGoHome = () => {
    resetQuiz()
    navigate("/")
  }

  if (!quizFinished && questions.length === 0) {
    return null 
  }

  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100)
  }

  const getResultMessage = () => {
    const percentage = calculatePercentage()

    if (percentage >= 90) {
      return "Outstanding! You're a true expert!"
    } else if (percentage >= 70) {
      return "Great job! You have solid knowledge!"
    } else if (percentage >= 50) {
      return "Good effort! Keep learning and improving!"
    } else {
      return "Keep practicing! You'll get better with time."
    }
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Quiz Results</h2>
        <p className="category-name">{currentCategory}</p>
        {isCustomQuiz && <p className="quiz-type">Community Quiz</p>}
        {saving && <p className="saving-status">Saving your results...</p>}
        {saved && <p className="saved-status">Results saved successfully!</p>}
      </div>

      <div className="results-summary">
        <div className="score-card">
          <div className="score-circle">
            <div className="score-percentage">{calculatePercentage()}%</div>
            <div className="score-text">
              {score} / {questions.length}
            </div>
          </div>
          <p className="result-message">{getResultMessage()}</p>
        </div>
      </div>

      <div className="results-actions">
        <button className="action-button try-again" onClick={handleTryAgain}>
          Try Again
        </button>
        <button className="action-button go-home" onClick={handleGoHome}>
          Go Home
        </button>
      </div>

      <div className="results-details">
        <h3>Question Review</h3>

        {questions.map((question, index) => {
          const userAnswer = answers.find((a) => a.questionIndex === index)?.answer

          return (
            <div key={index} className="question-review">
              <QuestionCard
                question={question}
                options={question.options}
                onAnswer={() => {}}
                questionNumber={index + 1}
                totalQuestions={questions.length}
                userAnswer={userAnswer}
                showResult={true}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Results
