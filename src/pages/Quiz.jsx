import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuiz } from "../contexts/QuizContext"
import QuestionCard from "../components/QuestionCard"
import Timer from "../components/Timer"
import { getQuizQuestions } from "../services/quizService"
import "../styles/Quiz.css"

function Quiz() {
  const { category } = useParams()
  const navigate = useNavigate()
  const {
    startQuiz,
    currentQuestionIndex,
    questions,
    quizStarted,
    quizFinished,
    score,
    answers,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    resetQuiz,
  } = useQuiz()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        console.log("Starting to load questions...")
        setLoading(true)
        setError(null)

        const fetchedQuestions = await getQuizQuestions(category, null, 10)
        console.log("Questions loaded:", fetchedQuestions)

        if (!fetchedQuestions || fetchedQuestions.length === 0) {
          throw new Error("No questions available for this category")
        }

        startQuiz(category, fetchedQuestions, 600)
        console.log("Quiz started successfully")
      } catch (err) {
        console.error("Error loading questions:", err)
        setError(err.message || "Failed to load quiz questions")
      } finally {
        setLoading(false)
      }
    }

    resetQuiz()
    loadQuestions()
  }, [category])

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
        <p>Loading {category} quiz questions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Error Loading Quiz</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Back Home</button>
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
        <p>Sorry, there are no questions available for the {category} category at the moment.</p>
        <button onClick={() => navigate("/")}>Go Back Home</button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const userAnswer = answers.find((a) => a.questionIndex === currentQuestionIndex)?.answer

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{category.charAt(0).toUpperCase() + category.slice(1)} Quiz</h2>
        <Timer initialTime={600} onTimeUp={handleTimeUp} />
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

export default Quiz
