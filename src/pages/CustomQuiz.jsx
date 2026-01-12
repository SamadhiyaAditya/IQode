import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuiz } from "../contexts/QuizContext"
import QuestionCard from "../components/QuestionCard"
import Timer from "../components/Timer"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import "../styles/Quiz.css"

function CustomQuiz() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const {
    startQuiz,
    currentQuestionIndex,
    questions,
    quizFinished,
    answers,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    resetQuiz,
  } = useQuiz()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizData, setQuizData] = useState(null)

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("Loading custom quiz:", quizId)
        setLoading(true)
        setError(null)

        const quizDoc = await getDoc(doc(db, "userQuizzes", quizId))

        if (!quizDoc.exists()) {
          throw new Error("Quiz not found")
        }

        const quiz = quizDoc.data()

        if (quiz.status !== "approved") {
          throw new Error("This quiz is not available")
        }

        setQuizData(quiz)

        // Shuffle questions for variation
        const shuffledQuestions = [...quiz.questions].sort(() => 0.5 - Math.random())

        startQuiz(
          quiz.category,
          shuffledQuestions,
          (quiz.timeLimit || 10) * 60,
          quizId,
          true,
        )

        console.log("Custom quiz started successfully")
      } catch (err) {
        console.error("Error loading custom quiz:", err)
        setError(err.message || "Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    // Reset quiz
    resetQuiz()
    loadQuiz()
  }, [quizId, resetQuiz, startQuiz])

  const handleTimeUp = () => {
    finishQuiz()
  }

  const handleFinishQuiz = () => {
    finishQuiz()
    navigate("/results")
  }

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loader"></div>
        <p>Loading quiz...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Error Loading Quiz</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/browse")}>Go Back to Browse</button>
      </div>
    )
  }

  if (quizFinished) {
    navigate("/results")
    return null
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-error">
        <h2>No Questions Available</h2>
        <p>This quiz doesn't have any questions.</p>
        <button onClick={() => navigate("/browse")}>Go Back to Browse</button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const userAnswer = answers.find((a) => a.questionIndex === currentQuestionIndex)?.answer

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h2>{quizData?.title || "Custom Quiz"}</h2>
          <p className="quiz-description">{quizData?.description}</p>
        </div>
        <Timer initialTime={(quizData?.timeLimit || 10) * 60} onTimeUp={handleTimeUp} />
      </div>

      <div className="quiz-content">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            options={currentQuestion.options}
            onAnswer={answerQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            userAnswer={userAnswer}
          />
        )}
      </div>

      <div className="quiz-navigation">
        <button className="nav-button prev" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button className="nav-button next" onClick={nextQuestion} disabled={!userAnswer}>
            Next
          </button>
        ) : (
          <button className="nav-button finish" onClick={handleFinishQuiz} disabled={!userAnswer}>
            Finish Quiz
          </button>
        )}
      </div>

      <div className="quiz-progress">
        <div
          className="progress-bar"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

export default CustomQuiz
