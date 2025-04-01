"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import loader from "./Spinner-5.gif"
import logo from "../assets/logo.png"

const Dashboard = () => {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showShareOptions, setShowShareOptions] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  const shareVideo = (platform, videoUrl) => {
    let shareUrl = ""
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(videoUrl)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(videoUrl)}`
        break
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(videoUrl)}`
        break
      default:
        console.log("Platform not supported")
        return
    }
    window.open(shareUrl, "_blank")
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const resp1 = await fetch(`${import.meta.env.VITE_BACKEND}/data/fetch`, {
          method: "GET",
        })
        if (resp1.ok) {
          const data = await resp1.json()
          setVideos(data)
          setFilteredVideos(data)
        }
      } catch (error) {
        console.error("Error is:", error)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    const filtered = videos.filter((video) =>
      video.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      video.title.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredVideos(filtered)
  }

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white">
      {loading ? (
        <img src={loader || "/placeholder.svg"} alt="loader" className="w-20 h-20 animate-bounce mt-32" />
      ) : (
        <div className="w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 bg-slate-800/50 p-4 rounded-2xl shadow-xl w-full">
            <div className="flex items-center gap-4">
              <img
                src={logo || "/placeholder.svg"}
                alt="EduKARI Logo"
                className="h-16 w-auto rounded-full shadow-lg shadow-black/50 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800"
              />
              <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                EduKARI
              </h1>
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full sm:w-80 p-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-lg transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Link to="/upload">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 transform hover:-translate-y-1">
                Add Video
              </button>
            </Link>
            <Link to="/board">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white rounded-xl font-semibold shadow-lg shadow-emerald-700/30 hover:shadow-emerald-700/50 transition-all duration-300 transform hover:-translate-y-1">
                Stream
              </button>
            </Link>
            <Link to="/jobs">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white rounded-xl font-semibold shadow-lg shadow-amber-700/30 hover:shadow-amber-700/50 transition-all duration-300 transform hover:-translate-y-1">
                Jobs
              </button>
            </Link>
            <Link to="/prep">
              <button className="w-full px-4 py-3 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-xl font-semibold shadow-lg shadow-purple-700/30 hover:shadow-purple-700/50 transition-all duration-300 transform hover:-translate-y-1">
                Prep
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <div
                  key={index}
                  className="p-5 bg-slate-800/80 shadow-2xl hover:shadow-blue-900/20 rounded-2xl border border-slate-700/50 transition-all duration-300 flex flex-col h-full hover:transform hover:scale-[1.02]"
                >
                  <h3 className="text-xl font-bold text-white mb-1">{video.name}</h3>
                  <h4 className="text-md text-sky-300 mb-3 font-medium">{video.title}</h4>
                  <p className="text-slate-300 mb-4 flex-1 text-sm leading-relaxed">
                    {expandedIndex === index ? video.description : `${video.description.slice(0, 100)}...`}
                    {video.description.length > 100 && (
                      <button
                        className="text-sky-400 hover:text-sky-300 ml-2 font-medium transition-colors duration-200"
                        onClick={() => toggleDescription(index)}
                      >
                        {expandedIndex === index ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </p>
                  <video controls className="w-full mb-5 rounded-xl shadow-lg object-cover border border-slate-700/50">
                    <source src={video.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    className="mb-3 px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-md"
                    onClick={() => setShowShareOptions(showShareOptions === index ? null : index)}
                  >
                    Share
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-slate-300 py-16 bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-lg">
                No videos available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
