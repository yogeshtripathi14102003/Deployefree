
import React from 'react';
import '../WebsiteComponent/firsthome.css'
import bgGif from '../assets/background.gif'; // <-- Use your GIF here

const FirstHomeComp = () => {
  return (
    <div className="video-container">
      <img
        className="background-gif"
        src={bgGif}
        alt="Background animation"
      />
      <div className="overlay">
        <h1>Welcome to Savtech </h1>
        <h3>Stay ahead with AI-powered smart solutions that drive innovation, enhance efficiency, and accelerate business growth-empowering you to thrive in a future-ready digital-world</h3>
      </div>
    </div>
  );
};

export default FirstHomeComp;


