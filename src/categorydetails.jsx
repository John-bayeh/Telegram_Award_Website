import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Import all images for different categories
import stem_murad from "./assets/stem_with_murad.jpg";
import kesem from "./assets/kesem.jpg";
import kelem from "./assets/kelem.jpg";
import Top from "./assets/Top_students.jpg";
import python from "./assets/python.jpg";
import arsenal from "./assets/arsenal.jpg";
import liverpool from "./assets/liverpool.jpg";
import united from "./assets/united.jpg";
import ftt from './assets/433.jpg';
import skysport from './assets/skysport.jpg';
import k from "./assets/k.jpg";
import sg from "./assets/sg.jpg";
import khan from './assets/khan2.jpg';
import arab from "./assets/arab.jpg";
import memeImg from './assets/meme.jpg';
import coding_humor from './assets/dark_humor.jpg';
import dark_humor from './assets/coding_humor.jpg';
import chatgpt from "./assets/chatgpt.jpg";
import ifttt from "./assets/ifttt.jpg";
import Spotybot from "./assets/spotify.jpg";
import Trivia from "./assets/Trivia.jpg";
import img1 from "./assets/tikvah.jpg";
import img2 from "./assets/technews.jpg";
import img3 from "./assets/tel.jpg";
import animation from "./assets/animation_film.jpg";
import music from "./assets/best_music.jpg";
import fourfourthree from "./assets/animation_film.jpg";
const allCategories = {
  tech: {
    id: "tech",
    name: "Best Tech Group",
    desc: "Award for Tech groups",
    competitors: [
      { id: 1, name: "STEM with Murad", username: "@STEMwithMurad", votes: 10, img: stem_murad },
      { id: 2, name: "KESEM Academy", username: "@KesemAcademy", votes: 7, img: kesem },
      { id: 3, name: "Keleme", username: "@Keleme", votes: 5, img: kelem },
      { id: 4, name: "Top Students", username: "@TopStudents", votes: 12, img: Top },
      { id: 5, name: "@CodeProgrammer", username: "@CodeProgrammer", votes: 1, img: python },
    ]
  },
  sport: {
    id: "sport",
    name: "Best Sport",
    desc: "Award for Sports groups",
    competitors: [
      { id: 1, name: "Zena Manchester United", username: "@zena_manchester_united", votes: 0, img: united },
      { id: 2, name: "Zena Arsenal", username: "@zena_arsenal", votes: 0, img: arsenal },
      { id: 3, name: "Zena Liverpool", username: "@zena_liverpool", votes: 0, img: liverpool },
      { id: 4, name: "4-3-3 Sport Ethiopia™", username: "", votes: 0, img: ftt },
      { id: 5, name: "Skysport ET™", username: "", votes: 0, img: skysport },
    ]
  },
  lifestyle: {
    id: "lifestyle",
    name: "Best Lifestyle",
    desc: "Award for Lifestyle channels",
    competitors: [
      { id: 1, name: "Третьякова Елена", username: "@tretyakovaele", votes: 0, img: k },
      { id: 2, name: "SG Travel+Lifestyle Hacks", username: "@youtripsg", votes: 0, img: sg },
      { id: 3, name: "Sahil Khan Lifestyle", username: "@sahilkhanstyle", votes: 0, img: khan },
      { id: 4, name: "راز جوانی", username: "@lifestyle3", votes: 0, img: arab },
    ]
  },
  meme: {
    id: "meme",
    name: "Best Meme Group",
    desc: "Award for Meme groups",
    competitors: [
      { id: 1, name: "Coding Humor", username: "@funnyvideosandmemesxplodecomedy", votes: 10, img: memeImg },
      { id: 2, name: "Memes", username: "@bestmemes", votes: 7, img: coding_humor },
      { id: 3, name: "Dark Humor Hub", username: "@darkjokeshere", votes: 15, img: dark_humor },
    ]
  },
  bot: {
    id: "bot",
    name: "Best Bot",
    desc: "Award for Bots",
    competitors: [
      { id: 1, name: "@GPT4Telegrambot", votes: 0, img: chatgpt },
      { id: 2, name: "@IFTTT", votes: 0, img: ifttt },
      { id: 3, name: "@Spotyy_bot", votes: 0, img: Spotybot },
      { id: 4, name: "@TriviaBot", votes: 0, img: Trivia },
    ]
  },
  news: {
    id: "news",
    name: "Best News Channel",
    desc: "Award for News channels",
    competitors: [
      { id: 1, name: "Telemetrio", username: "@telemetrio_news", votes: 0, img: img3 },
      { id: 2, name: "TIKVAH-ETHIOPIA", username: "@tikvahethiopia", votes: 0, img: img1 },
      { id: 3, name: "Discover Tech News", username: "@perplexity", votes: 0, img: img2 },
    ]
  },
  entertainment: {
    id: "entertainment",
    name: "Best Entertainment",
    desc: "Award for Entertainment groups",
    competitors: [
      { id: 1, name: "Entertainment One", username: "@ent1", votes: 0, img: animation },
      { id: 2, name: "Entertainment Two", username: "@ent2", votes: 0, img: music},
      { id: 2, name: "Entertainment Two", username: "@ent2", votes: 0, img: fourfourthree},
    ]
  },
};

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [votedId, setVotedId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const cat = allCategories[id];
    if (!cat) return;
    // Deep copy to avoid mutation of original data
    const catCopy = { ...cat, competitors: cat.competitors.map(c => ({ ...c })) };
    setCategory(catCopy);

    // Load previous vote from localStorage
    if (user?.votes && user.votes[id]) {
      setVotedId(user.votes[id]);
    }
  }, [id, user]);

  const handleVote = (competitorId) => {
    if (!user) return alert("You must login before voting.");
    if (votedId) return alert("You already voted in this category!");

    const updatedCompetitors = category.competitors.map(c =>
      c.id === competitorId ? { ...c, votes: c.votes + 1 } : c
    );

    setCategory({ ...category, competitors: updatedCompetitors });
    setVotedId(competitorId);

    const updatedUser = {
      ...user,
      votes: { ...user.votes, [id]: competitorId },
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert(`You voted for: ${category.competitors.find(c => c.id === competitorId).name}`);
  };

  if (!category) return <p className="text-white text-center mt-10">Category not found</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">{category.name}</h1>
      <p className="text-gray-400 mb-6">{category.desc}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.competitors.map(c => (
          <div
            key={c.id}
            className="bg-gray-900/60 border border-gray-700 p-5 rounded-2xl shadow-xl hover:shadow-yellow-500/20 hover:scale-105 transition-all flex flex-col items-center"
          >
            <img src={c.img} alt={c.name} className="w-full h-44 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold">{c.name}</h3>
            {c.username && <p className="text-gray-400 mt-1">{c.username}</p>}
            <div className="text-green-400 mt-2">Votes: {c.votes}</div>
            <button
              onClick={() => handleVote(c.id)}
              disabled={!!votedId}
              className={`mt-3 px-4 py-2 rounded ${
                votedId
                  ? c.id === votedId
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gray-700 opacity-50 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {c.id === votedId ? "Voted ✅" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
