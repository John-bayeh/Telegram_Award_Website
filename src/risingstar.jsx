import React,{useReducer} from "react";
export default function risingstar()
{
const initialRisingStars = [
  {
    id: 1,
    name: "TechNova 🚀",
    userName: "@technovachannel",
    link: "https://t.me/technovachannel",
    votes: 0,
    img: technovaImg,
    voted: false,
    disabled: false,
  },
  {
    id: 2,
    name: "MemeLab 😎",
    userName: "@memelabfun",
    link: "https://t.me/memelabfun",
    votes: 0,
    img: memelabImg,
    voted: false,
    disabled: false,
  },
  {
    id: 3,
    name: "Startup Ethiopia 🇪🇹",
    userName: "@startupethiopia",
    link: "https://t.me/startupethiopia",
    votes: 0,
    img: startupImg,
    voted: false,
    disabled: false,
  },
];

const [state,dispacth]=useReducer(useReducer,intialrisestar)

    return(
        <div>
          
        
        </div>
    )
}