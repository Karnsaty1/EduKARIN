import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Spinner-5.gif';
import logo from '../assets/Logo.png';

const Prep = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND}/data/prep`, { method: 'GET' });

        if (!response.ok) {
          console.log(response);
          return;
        }

        const data = await response.json();
        setCards(data.topics[0].topics);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchCards();
  }, []);

  const getContent = (title) => {
    navigate(`/prepDetail/${title}`);
  };

  return loading ? (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
      <img src={Loading} alt="Loading..." className="w-16 h-16 animate-bounce" />
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white">
      <header className="flex items-center gap-4 p-5 bg-slate-800/80  shadow-xl">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {cards.map((element, index) => (
            <div
              key={index}
              className="bg-slate-800/80  p-6 rounded-xl shadow-xl hover:shadow-blue-900/20 border border-slate-700/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              <img className="w-full h-48 object-cover rounded-lg" src={element.image} alt={element.title} />
              <div className="p-4 text-center">
                <h5 className="text-lg font-semibold text-white">{element.title}</h5>
                <p className="text-slate-300 mt-2 text-sm">{element.description}</p>
                <button
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50"
                  onClick={() => getContent(element.title)}
                >
                  Prepare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prep;
