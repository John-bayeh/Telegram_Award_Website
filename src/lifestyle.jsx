import React, { useReducer } from "react";
import k from "./assets/k.jpg";
import sg from "./assets/sg.jpg";
import khan from './assets/khan2.jpg';
import arab from './assets/arab.jpg';
export default function Lifestyle() {
  const initialLifestyle = [
    {
      id: 1,
      name: "Третьякова Елена Блогер 👧 Материнство-Lifestyle-Beauty",
      userName: "@tretyakovaele",
      link: "https://t.me/tretyakovaele",
      votes: 0,
      img: k,
      voted: false,
      disabled: false,
    },
    {
      id: 2,
      name: "SG Travel+Lifestyle Hacks",
      userName: "@youtripsg",
      link: "https://t.me/youtripsg",
      votes: 0,
      img: sg,
      voted: false,
      disabled: false,
    },
    {
      id: 3,
      name: "Sahil Khan Lifestyle",
      userName: "@sahilkhanstyle",
      link: "https://t.me/sahilkhanstyle",
      votes: 0,
      img: khan,
      voted: false,
      disabled: false,
    },{
      id: 4,
      name: "راز جوانی",
      userName: "@lifestyle3",
      link: "https://t.me/lifestyle3",
      votes: 0,
      img: arab,
      voted: false,
      disabled: false,
    },
  ];

  // Reducer
  function Reducer(state, action) {
    switch (action.type) {
      case "vote":
        return state.map((life) =>
          life.id === action.id
            ? { ...life, votes: life.votes + 1, voted: true }
            : { ...life, disabled: true } // others can't be clicked but not marked as voted
        );
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(Reducer, initialLifestyle);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center"> Best Lifestyle</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.map((life) => (
          <div
            key={life.id}
            className="border border-gray-700 rounded-lg p-4 flex flex-col items-center shadow-lg hover:bg-gray-800 transition-all"
          >
            <img
              className="w-full h-48 object-cover rounded-md mb-3"
              src={life.img}
              alt={life.name}
            />
            <h2 className="text-lg text-center font-semibold mb-1">{life.name}</h2>
            <a
              href={life.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:underline mb-3"
            >
              {life.link}
            </a>

            <button
              onClick={() => dispatch({ type: "vote", id: life.id })}
              disabled={life.voted || life.disabled}
              className={`px-4 py-2 rounded-md font-semibold ${
                life.voted
                  ? "bg-green-600 text-white"
                  : life.disabled
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-blue-500 hover:bg-blue-400 text-black"
              }`}
            >
              {life.voted ? "Voted ✅" : life.disabled ? "Vote" : "Vote"}
            </button>

            <p className="mt-2 text-sm text-gray-300">
              Votes:{" "}
              <span className="font-bold text-yellow-400">{life.votes}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
