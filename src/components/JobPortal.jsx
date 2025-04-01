"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import Loading from "./Spinner-5.gif"
import logo from "../assets/Logo.png"

const JobPortal = () => {
  const uniqueId = uuidv4()
  const generateLink = (path) => `/${path.slice(1, 5)}/${uniqueId}`
  const [cards, setCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [error, setError] = useState("")
  const [loader, setLoader] = useState(false)

  const removeHTMLTags = (text) => text.replace(/<[^>]*>/g, "")

  const searchBar = (event) => {
    const query = event.target.value.toLowerCase()
    if (!query) {
      setFilteredCards(cards)
      return
    }
    const filteredElements = cards.filter(
      (element) =>
        element.company_name.toLowerCase().includes(query) ||
        element.title.toLowerCase().includes(query) ||
        removeHTMLTags(element.description).toLowerCase().includes(query),
    )
    setFilteredCards(filteredElements)
  }

  useEffect(() => {
    setLoader(true)
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://www.arbeitnow.com/api/job-board-api")
        if (!response.ok) {
          setError("Failed to fetch jobs")
          return
        }
        const data = await response.json()
        setCards(data.data)
        setFilteredCards(data.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoader(false)
      }
    }

    fetchPosts()
  }, [])

  const toggleDescription = (index) => {
    setFilteredCards((prevCards) =>
      prevCards.map((card, idx) =>
        idx === index ? { ...card, isDescriptionExpanded: !card.isDescriptionExpanded } : card,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white">
      <header className="flex items-center gap-4 p-5 bg-slate-800/80 shadow-xl">
        <img
          src={logo || "/placeholder.svg"}
          alt="EduKARI Logo"
          className="h-14 w-auto rounded-full shadow-lg shadow-black/50 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800"
        />
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          EduKARI
        </h1>
      </header>

      <div className="container mx-auto p-5">
        {loader ? (
          <div className="flex justify-center items-center mt-20">
            <img src={Loading || "/placeholder.svg"} alt="Loading..." className="w-20 h-20 animate-bounce" />
          </div>
        ) : (
          <>
            {error ? (
              <div className="text-center bg-red-500/20  border-red-500/50 rounded-xl p-6 mt-10 max-w-lg mx-auto shadow-lg">
                <p className="text-xl font-bold text-red-300 mb-2">Failed To Load Postings</p>
                <p className="text-red-200">{error}</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mt-8">
                  <input
                    type="text"
                    onChange={searchBar}
                    className="w-full max-w-2xl p-4 bg-slate-700/80 border border-slate-600/50 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400"
                    placeholder="Search jobs by title, description, company..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                  {filteredCards.map((element, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/80  p-6 rounded-xl shadow-xl hover:shadow-blue-900/20 border border-slate-700/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                    >
                      <h3 className="text-xl font-bold text-white">{element.company_name}</h3>
                      <h5 className="text-sky-300 font-medium mt-2">Job Title: {element.title}</h5>
                      <p
                        className={`text-sm text-slate-300 mt-3 leading-relaxed ${element.isDescriptionExpanded ? "" : "line-clamp-3"}`}
                      >
                        {removeHTMLTags(element.description)}
                      </p>
                      <span
                        className="text-sky-400 hover:text-sky-300 cursor-pointer text-sm mt-2 inline-block font-medium transition-colors duration-200"
                        onClick={() => toggleDescription(index)}
                      >
                        {element.isDescriptionExpanded ? "Read Less" : "Read More"}
                      </span>
                      <p className="text-sm text-slate-300 mt-3">
                        Job Type: <span className="text-sky-300">{element.job_types.join(", ")}</span>
                      </p>
                      <p className="text-sm text-slate-300">
                        Location: <span className="text-sky-300">{element.location}</span>
                      </p>
                      <p className="text-sm text-slate-300">
                        Posted At:{" "}
                        <span className="text-sky-300">{new Date(element.created_at * 1000).toLocaleDateString()}</span>
                      </p>
                      <small className="block text-xs text-slate-400 mt-3">Tags: {element.tags.join(", ")}</small>
                      <a href={element.url} target="_blank" rel="noopener noreferrer">
                        <button className="mt-5 w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50">
                          Apply Now
                        </button>
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default JobPortal

