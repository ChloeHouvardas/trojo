import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/HomePage";
import {useEffect} from 'react';

// click to go from landing page to emails
const ClickToNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClick = () => {
      if (location.pathname === '/') {
        navigate('/emails');
      }
    };

    // add event listener to doc
    document.addEventListener('click', handleClick);

    // cleanup event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [navigate, location]);
  return null;
};



export default function App() {
  return (
    <BrowserRouter>
      <ClickToNavigate />
      <Routes>
          <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);