import React, { useReducer, useState } from "react";
import meme from './assets/meme.jpg';
import coding_humor from './assets/dark_humor.jpg';
import dark_humor from './assets/coding_humor.jpg';

const initialMemes = [
  {
    img: meme,
    id: 1,
    name: "Coding Humor",
    link: "https://t.me/funnyvideosandmemesxplodecomedy",
    username: "@funnyvideosandmemesxplodecomedy",
    votes: 10
  },
  {
    img: coding_humor,
    id: 2,
    name: "Memes",
    link: "https://t.me/bestmemes",
    username: "@bestmemes",
    votes: 7
  },
  {
    img: dark_humor,
    id: 3,
    name: "Dark Humor Hub",
    link: "https://t.me/darkjokeshere",
    username: "@darkjokeshere",
    votes: 15
  },
];

function reducer(state, action) {
  switch (action.type) {
    case "VOTE":
      return state.map((meme) =>
        meme.id === action.id ? { ...meme, votes: meme.votes + 1 } : meme
      );
    default:
      return state;
  }
}

export default function Meme() {
  const [memes, dispatch] = useReducer(reducer, initialMemes);
  const [votedMemeId, setVotedMemeId] = useState(null);

  function handleVote(meme) {
    if (votedMemeId) {
      alert(`You already voted for: ${memes.find(m => m.id === votedMemeId).name}`);
      return;
    }

    const confirmVote = window.confirm(`Vote for "${meme.name}"?`);
    if (confirmVote) {
      dispatch({ type: "VOTE", id: meme.id });
      setVotedMemeId(meme.id);
      alert(`You voted for: ${meme.name}`);
    }
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Meme Voting</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="border border-gray-700 p-4 rounded-lg flex flex-col items-center hover:bg-gray-800 transition-all cursor-pointer"
            onClick={() => handleVote(meme)}
          >
            <img className="w-48 h-48 rounded-lg mb-4 object-cover" src={meme.img} alt={meme.name} />
            
            <span className="text-white text-lg font-semibold">{meme.name}</span>
            
            {/* clickable username link */}
            <a
              href={meme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline mt-1"
              onClick={(e) => e.stopPropagation()} // prevents triggering the vote on click
            >
              {meme.username}
            </a>

            <span className="text-green-400 text-lg mt-2">
              Votes: {meme.votes}
            </span>

            <button
              className={`mt-3 px-4 py-2 rounded ${
                votedMemeId
                  ? meme.id === votedMemeId
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gray-700 opacity-50 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={!!votedMemeId}
            >
              {meme.id === votedMemeId ? "Voted ✅" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
