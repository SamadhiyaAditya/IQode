import { createContext, useContext, useState, useReducer } from "react"

const QuizContext = createContext()

export function useQuiz() {
  return useContext(QuizContext)
}

const initialState = {
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  timeRemaining: 0,
  quizStarted: false,
  quizFinished: false,
  currentCategory: null,
  questions: [],
  quizId: null,
  isCustomQuiz: false,
}

function quizReducer(state, action) {
  switch (action.type) {
    case "START_QUIZ":
      return {
        ...state,
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        timeRemaining: action.payload.timeLimit,
        quizStarted: true,
        quizFinished: false,
        currentCategory: action.payload.category,
        questions: action.payload.questions,
        quizId: action.payload.quizId || null,
        isCustomQuiz: action.payload.isCustomQuiz || false,
      }
    case "ANSWER_QUESTION":
      const isCorrect = state.questions[state.currentQuestionIndex].correctAnswer === action.payload
      return {
        ...state,
        score: isCorrect ? state.score + 1 : state.score,
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentQuestionIndex,
            answer: action.payload,
            isCorrect,
          },
        ],
      }
    case "NEXT_QUESTION":
      const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        quizFinished: isLastQuestion,
      }
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      }
    case "UPDATE_TIME":
      return {
        ...state,
        timeRemaining: action.payload,
      }
    case "FINISH_QUIZ":
      return {
        ...state,
        quizFinished: true,
      }
    case "RESET_QUIZ":
      return initialState
    default:
      return state
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Start a quiz with selected category
  const startQuiz = (category, questions, timeLimit = 600, quizId = null, isCustomQuiz = false) => {
    dispatch({
      type: "START_QUIZ",
      payload: { category, questions, timeLimit, quizId, isCustomQuiz },
    })
  }

  // Answer current question
  const answerQuestion = (answer) => {
    dispatch({
      type: "ANSWER_QUESTION",
      payload: answer,
    })
  }

  // Move to next question
  const nextQuestion = () => {
    dispatch({ type: "NEXT_QUESTION" })
  }

  // Move to previous question
  const previousQuestion = () => {
    dispatch({ type: "PREVIOUS_QUESTION" })
  }

  // Update remaining time
  const updateTime = (time) => {
    dispatch({
      type: "UPDATE_TIME",
      payload: time,
    })
  }

  // Finish quiz
  const finishQuiz = async () => {
    dispatch({ type: "FINISH_QUIZ" })
  }

  // Reset quiz state
  const resetQuiz = () => {
    dispatch({ type: "RESET_QUIZ" })
  }

  const value = {
    ...state,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    updateTime,
    finishQuiz,
    resetQuiz,
    loading,
    error,
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
