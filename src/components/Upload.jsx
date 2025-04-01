"use client"

import { useState } from "react"
import loader from "./Spinner-5.gif"
import logo from "../assets/Logo.png"

const Upload = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null,
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("video", formData.video)

      const resp = await fetch(`${import.meta.env.VITE_BACKEND}/data/upload`, {
        method: "POST",
        credentials: "include",
        body: data,
      })
      if (!resp.ok) {
        console.error(await resp.text())
      } else {
        alert("Uploaded Successfully!")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return loading ? (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-800 to-slate-900">
      <img src={loader || "/placeholder.svg"} alt="loader" className="w-20 h-20 animate-bounce" />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white p-4">
      <div className="absolute top-6 left-6 flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl  shadow-xl">
        <img
          src={logo || "/placeholder.svg"}
          alt="EduKARI Logo"
          className="h-14 w-auto rounded-full shadow-lg shadow-black/50 ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800"
        />
        <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          EduKARI
        </h2>
      </div>
      <h2 className="text-4xl font-bold mt-16 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-sky-300">
        Upload Here
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="w-full max-w-lg bg-slate-800/80  p-8 rounded-2xl shadow-2xl flex flex-col gap-5 mt-8 border border-slate-700/50"
      >
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          className="p-4 rounded-xl bg-slate-700/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner border border-slate-600/50 placeholder-slate-400"
          required
        />
        <textarea
          name="description"
          placeholder="Video Description"
          value={formData.description}
          onChange={handleChange}
          className="p-4 rounded-xl bg-slate-700/80 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-36 resize-none shadow-inner border border-slate-600/50 placeholder-slate-400"
          required
        />
        <div className="relative p-4 rounded-xl bg-slate-700/80 border border-slate-600/50 shadow-inner">
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
            className="w-full text-slate-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:transition-colors file:duration-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 transform hover:-translate-y-1 mt-2"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Upload

