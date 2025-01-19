import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css';
import GUY_HANGING from '../assets/GUY_HANGING.png'; // Adjust the path to match your folder structure

const Loading = () => {
  const navigate = useNavigate();
  const messages = ["Working on it", "Fetching emails", "Going fishing"];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Rotate messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 1000);

    // Navigate to /emails after 6 seconds
    const timer = setTimeout(() => {
      navigate('/emails');
    }, 3000);

    // Cleanup intervals and timeouts on unmount
    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [navigate, messages.length]);

  return (
    <div className="loading-container">
      <div className="image-container">
        <img src={GUY_HANGING} alt="Guy hanging" className="spinning-image" />
      </div>
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
      <p className="loading-message">{messages[currentMessageIndex]}</p>
    </div>
  );
};

export default Loading;
