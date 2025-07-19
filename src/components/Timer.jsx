import { useState, useEffect, useRef } from "react"
import "../styles/Timer.css"

function Timer({ initialTime, onTimeUp, isPaused = false }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      return
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current)
          onTimeUp()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [initialTime, onTimeUp, isPaused])

  // Time format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Determine timer color
  const getTimerClass = () => {
    if (timeRemaining <= 10) return "timer-critical"
    if (timeRemaining <= 60) return "timer-warning"
    return ""
  }

  return (
    <div className={`timer ${getTimerClass()}`}>
      <div className="timer-display">{formatTime(timeRemaining)}</div>
      <div className="timer-progress" style={{ width: `${(timeRemaining / initialTime) * 100}%` }}></div>
    </div>
  )
}

export default Timer
