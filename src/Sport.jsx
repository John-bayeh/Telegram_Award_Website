import React, { useReducer, useState } from "react";
import arsenal from "./assets/arsenal.jpg";
import liverpool from "./assets/liverpool.jpg";
import united from "./assets/united.jpg";
import ftt from './assets/433.jpg';
import skysport from './assets/skysport.jpg';
export default function Sports() {
  const initialSports = [
    { id: 1, name: "Zena Manchester United", username: "@zena_manchester_united", link: "https://t.me/zena_manchester_unitedhttps://t.me/Manchester_Unitedfanns", image: united, votes: 0 },
    { id: 2, name: "Zena Arsenal", username: "@zena_arsenal", link: "https://t.me/zena_arsenal", image: arsenal, votes: 0 },
    { id: 3, name: "Zena Liverpool", username: "@zena_liverpool", link: "https://t.me/zena_liverpool", image: liverpool, votes: 0 },
    { id: 4, name: "4-3-3 ስፖርት በኢትዮጵያ™", username: "", link: "https://t.me/Bisrat_Sport_433eth2", image:ftt, votes: 0 },
    { id: 5, name: "ስካይ Sport ET™", username: "", link: "https://t.me/SSport_Ethiopia", image: skysport, votes: 0 },
    
  ];

  function reducer(state, action) {
    switch (action.type) {
      case "VOTE":
        return state.map((team) =>
          team.id === action.id ? { ...team, votes: team.votes + 1 } : team
        );
      default:
        return state;
    }
  }

  const [sports, dispatch] = useReducer(reducer, initialSports);
  const [votedId, setVotedId] = useState(null);

  function handleVote(team) {
    if (votedId) {
      alert(`You already voted for: ${sports.find((i) => i.id === votedId).name}`);
      return;
    }
    dispatch({ type: "VOTE", id: team.id });
    setVotedId(team.id);
    alert(`You voted for: ${team.name}`);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 min-h-screen bg-black text-white p-6">
      {sports.map((sport) => (
        <div
          key={sport.id}
          className="border border-gray-700 rounded-2xl p-2 flex flex-col items-center bg-gray-900"
        >
          <img src={sport.image} alt={sport.name} className="w-40 h-40 rounded-full mb-4 object-cover" />
          <h2 className="text-xl font-semibold mb-1">{sport.name}</h2>
          <a href={sport.link} className="text-blue-400 mb-2 hover:underline">
            {sport.username}
          </a>
          <p className="text-green-400 mb-3">Votes: {sport.votes}</p>
          <button
            onClick={() => handleVote(sport)}
            className={`px-4 py-2 rounded text-white font-semibold ${
              votedId === sport.id
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {votedId === sport.id ? "Voted ✅" : "Vote"}
          </button>
        </div>
      ))}
    </div>
  );
}
