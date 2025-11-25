import React, { useReducer } from "react";
import chatgpt from "./assets/chatgpt.jpg";
import ifttt from "./assets/ifttt.jpg";
import Spotybot from "./assets/spotify.jpg";
import Trivia from "./assets/Trivia.jpg";

export default function Upgrade() {
  const initialBots = [
    { id: 1, name: "@GPT4Telegrambot", link: "https://t.me/GPT4Telegrambot", img: chatgpt, votes: 0 },
    { id: 2, name: "@IFTTT", link: "https://t.me/IFTTT", img: ifttt, votes: 0 },
    { id: 3, name: "@Spotyy_bot", link: "https://t.me/Spotyy_bot", img: Spotybot, votes: 0 },
    { id: 4, name: "@TriviaBot", link: "https://t.me/TriviaBot", img: Trivia, votes: 0 },
  ];

  function reducer(state, action) {
    switch (action.type) {
      case "vote":
        // Mark all as unselected except the one voted
        return state.map((bot) =>
          bot.id === action.id
            ? { ...bot, votes: bot.votes + 1, voted: true }
            : { ...bot, voted: false, disabled: true }
        );
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialBots);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-indigo-700">Vote Your Favorite Bot</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {state.map((bot) => (
          <div
            key={bot.id}
            className="bg-gray-600 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform"
          >
            <img
              src={bot.img}
              alt={bot.name}
              className="w-48 h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">{bot.name}</h2>
            <a
              href={bot.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mb-4"
            >
              Visit Bot
            </a>

            <button
              onClick={() => dispatch({ type: "vote", id: bot.id })}
              disabled={bot.voted || bot.disabled}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                bot.voted
                  ? "bg-green-500 cursor-not-allowed"
                  : bot.disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {bot.voted ? "✅ Voted" : "Vote"}
            </button>

            <p className="mt-2 text-gray-700 font-medium">Votes: {bot.votes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
