import React, { useReducer } from "react";
import img1 from "./assets/tikvah.jpg";
import img2 from "./assets/technews.jpg";
import img3 from "./assets/tel.jpg";

export default function App() {
  const initialNews = [
    {
      id: 1,
      name: "🇬🇧 Telemetrio - Analytics of Telegram Channels",
      userName: "@telemetrio_news",
      link: "https://t.me/telemetrio_news",
      img: img3,
      votes: 0,
    },
    {
      id: 2,
      name: "🇪🇹 TIKVAH-ETHIOPIA",
      userName: "@tikvahethiopia",
      link: "https://t.me/tikvahethiopia",
      img: img1,
      votes: 0,
    },
    {
      id: 3,
      name: "🇬🇧 Discover • Tech News",
      userName: "@perplexity",
      link: "https://t.me/perplexity",
      img: img2,
      votes: 0,
    },
  ];

  // Reducer function
  function reducer(state, action) {
    switch (action.type) {
      case "vote":
        return state.map((item) =>
          item.id === action.id
            ? { ...item, votes: item.votes + 1, voted: true }
            : { ...item, disabled: true }
        );
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialNews);

  return (
    <div className="min-h-screen bg-black p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">🗳️ Vote for Best News Channel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.map((news) => (
          <div
            key={news.id}
            className="border border-gray-300 rounded-2xl shadow-md p-4 flex flex-col items-center bg-gray-900 hover:bg-gray-800 transition-all   text-white"
          >
            <img
              src={news.img}
              alt={news.name}
              className="w-48 h-48 object-cover rounded-xl mb-3"
            />
            <h2 className="text-lg font-semibold mb-1">{news.name}</h2>
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mb-3"
            >
              {news.userName}
            </a>
            <button
              onClick={() => dispatch({ type: "vote", id: news.id })}
              disabled={news.voted || news.disabled}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                news.voted
                  ? "bg-green-500 cursor-not-allowed"
                  : news.disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {news.voted ? "✅ Voted" : "Vote"}
            </button>
            <p className="mt-2 text-gray-600">Votes: {news.votes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
