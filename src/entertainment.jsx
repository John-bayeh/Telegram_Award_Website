import React, { useReducer, useState } from "react";
import animation from "./assets/animation_film.jpg";
import music from "./assets/best_music.jpg";
import fourfourthree from "./assets/animation_film.jpg"; // you can replace with another if you have

export default function Entertainment() {
  const initialEntertainment = [
    {
      id: 1,
      name: "Animation Film Channel",
      image: animation,
      link: "https://t.me/Films_433",
      userName: "@Films_433",
      votes: 5,
    },
    {
      id: 2,
      name: "Best Telegram Music Channel",
      image: music,
      link: "https://t.me/best_telegram_music_ch",
      userName: "@best_telegram_music_ch",
      votes: 8,
    },
    {
      id: 3,
      name: "Football & Highlights Channel",
      image: fourfourthree,
      link: "https://t.me/fourfourthree",
      userName: "@fourfourthree",
      votes: 12,
    },
  ];

  const [votedId, setVotedId] = useState(null);
  const [entertain, dispatch] = useReducer(reducer, initialEntertainment);

  function reducer(state, action) {
    switch (action.type) {
      case "VOTE":
        return state.map((item) =>
          item.id === action.id ? { ...item, votes: item.votes + 1 } : item
        );
      default:
        return state;
    }
  }

  function handleVote(item) {
    if (votedId) {
      alert(
        `You already voted for: ${
          entertain.find((i) => i.id === votedId).name
        }`
      );
      return;
    }
    dispatch({ type: "VOTE", id: item.id });
    setVotedId(item.id);
    alert(`You voted for: ${item.name}`);
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-center text-amber-400">
        Best Entertainment Channels
      </h1>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {entertain.map((item) => (
          <div
            key={item.id}
            className="border border-gray-700 rounded-2xl p-6 flex flex-col items-center bg-gray-900 hover:bg-gray-800 transition-all shadow-md"
          >
            <img
              className="w-40 h-40 rounded-full object-cover mb-4"
              src={item.image}
              alt={item.name}
            />
            <h2 className="text-xl font-semibold mb-1 text-white">
              {item.name}
            </h2>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline mb-2"
            >
              {item.userName}
            </a>
            <p className="text-green-400 mb-3">Votes: {item.votes}</p>
            <button
              onClick={() => handleVote(item)}
              disabled={votedId !== null}
              className={`px-4 py-2 rounded text-white font-semibold ${
                votedId === item.id
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {votedId === item.id ? "Voted ✅" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
