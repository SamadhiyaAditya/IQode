"use client"

import { useState, useEffect } from "react"
import "../styles/QuestionCard.css"

function QuestionCard({
  question,
  options,
  onAnswer,
  questionNumber,
  totalQuestions,
  userAnswer = null,
  showResult = false,
}) {
  const [selectedOption, setSelectedOption] = useState(userAnswer)

  // Update selected option when userAnswer changes
  useEffect(() => {
    setSelectedOption(userAnswer)
  }, [userAnswer])

  const handleOptionSelect = (option) => {
    if (showResult) return // Prevent changing answer in results view

    setSelectedOption(option)
    onAnswer(option)
  }

  const getOptionClass = (option) => {
    if (!showResult) {
      return option === selectedOption ? "selected" : ""
    }

    if (option === question.correctAnswer) {
      return "correct"
    }

    if (option === selectedOption && option !== question.correctAnswer) {
      return "incorrect"
    }

    return ""
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      <h3 className="question-text">{question.text}</h3>

      <div className="options-container">
        {options.map((option, index) => (
          <div key={index} className={`option ${getOptionClass(option)}`} onClick={() => handleOptionSelect(option)}>
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>

      {showResult && (
        <div className="question-feedback">
          {selectedOption === question.correctAnswer ? (
            <p className="correct-feedback">Correct! ✓</p>
          ) : (
            <p className="incorrect-feedback">Incorrect. The correct answer is: {question.correctAnswer}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
