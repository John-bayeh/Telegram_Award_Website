import React, { useState } from "react";
import "./index.css";
import kesem from "./assets/kesem.jpg";
import kelem from "./assets/kelem.jpg";
import stem_murad from "./assets/stem_with_murad.jpg";
import Top from "./assets/Top_students.jpg";
import python from './assets/python.jpg';

const initialStem = [
  { id: 1, name: "STEM with Murad", image: stem_murad, link: "https://t.me/STEMwithMurad", username: "@STEMwithMurad", votes: 10 },
  { id: 2, name: "KESEM Academy", image: kesem, link: "https://t.me/Kesemacadem", username: "@KesemAcademy", votes: 7 },
  { id: 3, name: "Keleme", image: kelem, link: "https://t.me/keleme_2013", username: "@Keleme", votes: 5 },
  { id: 4, name: "Top Students", image: Top, link: "https://t.me/top_students1", username: "@TopStudents", votes: 12 },
  { id: 5, name: "Code Programmer", image: python, link: "https://t.me/CodeProgrammer", username: "@CodeProgrammer", votes: 1 },
];

export default function BestEducation() {
  // Load saved votes from localStorage or default to initialStem
  const [stem, setStem] = useState(() => {
    const savedVotes = localStorage.getItem("techVotes");
    return savedVotes ? JSON.parse(savedVotes) : initialStem;
  });

  // Load voted competitor ID from user info in localStorage
  const [votedId, setVotedId] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    return user?.votes?.tech || null;
  });

  const handleVote = (item) => {
    if (!localStorage.getItem("user")) {
      alert("You must login before voting!");
      return;
    }

    if (votedId) {
      alert(`You already voted for: ${stem.find(s => s.id === votedId).name}`);
      return;
    }

    const confirmVote = window.confirm(`Vote for "${item.name}"?`);
    if (!confirmVote) return;

    // Update vote count
    const updatedStem = stem.map(s => 
      s.id === item.id ? { ...s, votes: s.votes + 1 } : s
    );

    setStem(updatedStem);
    setVotedId(item.id);

    // Save votes for this category in localStorage
    localStorage.setItem("techVotes", JSON.stringify(updatedStem));

    // Save user's vote in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      user.votes = { ...user.votes, tech: item.id };
      localStorage.setItem("user", JSON.stringify(user));
    }

    alert(`You voted for: ${item.name}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 bg-black min-h-screen text-white gap-6 p-6">
      {stem.map((item) => (
        <div
          key={item.id}
          className="border border-gray-600 rounded-lg flex flex-col items-center p-4 hover:bg-gray-800 transition-all"
        >
          <img
            className="w-48 h-48 object-cover rounded-full mb-3"
            src={item.image}
            alt={item.name}
          />
          <div className="text-lg font-semibold">{item.name}</div>
          <a
            className="text-blue-400 hover:underline mt-1"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {item.username}
          </a>
          <div className="text-green-400 mt-2">Votes: {item.votes}</div>
          <button
            className={`mt-3 px-4 py-2 rounded ${
              votedId
                ? item.id === votedId
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gray-700 opacity-50 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={() => handleVote(item)}
            disabled={!!votedId}
          >
            {item.id === votedId ? "Voted ✅" : "Vote"}
          </button>
        </div>
      ))}
    </div>
  );
}
