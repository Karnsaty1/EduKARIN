"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Loading from "./Spinner-5.gif"

const PrepDetails = () => {
  const { topic } = useParams()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/data/prepDetail/${topic}`)
        const data = await response.json()
        setQuestions(data.topics[0].questions_and_answers)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }

    fetchQuestions()
  }, [topic])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-white flex items-center justify-center p-4 md:p-8 backdrop-blur-sm bg-opacity-95">
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px] backdrop-blur-md bg-blue-900/30 p-10 rounded-full">
          <img
            src={Loading || "/placeholder.svg"}
            alt="Loading..."
            className="w-20 h-20 animate-spin opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        </div>
      ) : (
        <div className="max-w-4xl w-full mx-auto my-10 p-8 md:p-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-3xl border-2 border-blue-400/50 backdrop-filter backdrop-blur-sm">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-12 pb-6 capitalize tracking-wide relative after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-1 after:bg-gradient-to-r after:from-transparent after:via-yellow-400 after:to-transparent">
            {topic} - Interview Questions
          </h1>
          <ul className="space-y-10">
            {questions.map((item, index) => (
              <li
                key={index}
                className="p-7 md:p-9 bg-gradient-to-br from-purple-800 via-purple-700 to-pink-600 border border-yellow-300/50 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-yellow-300 group"
              >
                <div className="text-xl md:text-2xl font-bold text-yellow-200 mb-6 flex items-start leading-tight">
                  <span className="text-yellow-400 mr-3 text-3xl md:text-4xl font-black opacity-90 -ml-2">
                    Q{index + 1}
                  </span>
                  <span className="mt-1 group-hover:text-yellow-300 transition-colors duration-300">
                    {item.question}
                  </span>
                </div>
                <div className="text-lg leading-relaxed bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 p-6 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)] border border-yellow-300/70 transform transition-all duration-300 group-hover:translate-y-1 group-hover:shadow-[inset_0_3px_15px_rgba(0,0,0,0.3)]">
                  <span className="font-black text-gray-900/80 mr-2 text-xl">A:</span> {item.answer}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PrepDetails

