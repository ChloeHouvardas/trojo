import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Install axios for API calls: npm install axios
import './Emails.css'; // Import the CSS file
import GUY_STOPPING from '../assets/GUY_STOPPING.png'; // Adjust the path

const Emails = () => {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatText, setChatText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const message = "Phew, that was a close one"; // The message to display

  useEffect(() => {
    if (isImageVisible) {
      // Show chat box after animation
      const chatTimeout = setTimeout(() => {
        setShowChat(true);
        let currentText = "";
        let index = 0;

        const typeInterval = setInterval(() => {
          currentText += message[index];
          setChatText(currentText);
          index++;

          if (index >= message.length) {
            clearInterval(typeInterval); // Stop typing effect when done
            setShowButton(true); // Show the "Tell me more" button
          }
        }, 100); // Adjust typing speed here
      }, 2000); // Delay for animation duration (2 seconds)

      return () => clearTimeout(chatTimeout); // Cleanup timeout on unmount
    } else {
      // Reset chat box when image visibility is toggled off
      setShowChat(false);
      setChatText("");
      setShowButton(false);
    }
  }, [isImageVisible]);

  const highlightWords = (text) => {
    const wordsToHighlight = ["and", "the"]; // Words to highlight
    const regex = new RegExp(`\\b(${wordsToHighlight.join("|")})\\b`, "gi"); // Match whole words only

    return text.split(regex).map((word, index) => {
      if (wordsToHighlight.includes(word.toLowerCase())) {
        return (
          <span
            key={index}
            className="highlight"
            onClick={() => setIsImageVisible(true)}
          >
            {word}
          </span>
        );
      }
      return word;
    });
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    // Display the user's message in the chat
    setChatMessages([...chatMessages, { sender: "user", text: chatInput }]);

    try {
      // Send the message to the Flask backend
      const response = await axios.post("http://localhost:5000/chat", {
        message: chatInput,
      });

      const botResponse = response.data.response;

      // Display the chatbot's response
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }

    setChatInput(""); // Clear the input field
  };

  const closeChatBubble = () => {
    setIsImageVisible(false); // Hide the image
    setShowChat(false); // Close the chat bubble
    setChatText("");
    setShowButton(false);
    setIsChatBotOpen(false);
  };

  const emails = [
    {
      title: "Email 1",
      content: `Dear Team,
      I hope this email finds you well. I wanted to take a moment to update you on the progress of our current project. Over the past few weeks, we have made significant strides in the development phase, and I am pleased to report that we are on track to meet our deadlines. The design team has completed the initial mockups, and the development team is now working on the implementation. We have encountered a few challenges along the way, but we have managed to overcome them through collaboration and innovative problem-solving. I am confident that we will continue to make great progress in the coming weeks. Thank you for your hard work and dedication to this project.`,
      signature: "Best regards,\nProject Manager",
    },
    {
      title: "Email 2",
      content: `Hi Everyone,
      I wanted to remind you all about the upcoming team meeting scheduled for next Monday at 10 AM. During this meeting, we will be discussing the latest updates on our project, reviewing the current status of our tasks, and planning the next steps. It is important that everyone attends this meeting, as we will be making some critical decisions that will impact our timeline and deliverables. Please come prepared with any questions or concerns you may have, as well as any updates on your individual tasks. I look forward to seeing you all there and working together to ensure the success of our project.`,
      signature: "Best,\nTeam Lead",
    },
    {
      title: "Email 3",
      content: `Hello Team,
      I am writing to inform you about a new initiative that we will be launching next month. This initiative aims to improve our internal communication and collaboration by implementing a new project management tool. The tool will help us streamline our workflows, track progress more effectively, and enhance our overall productivity. We will be providing training sessions for all team members to ensure a smooth transition to the new system. I believe this change will greatly benefit our team and help us achieve our goals more efficiently. Please stay tuned for more details and the schedule for the training sessions.`,
      signature: "Thank you,\nOperations Manager",
    },
  ];

  return (
    <div className="emails-container">
      <h1 className="emails-header">Emails</h1>
      <div className="email-list">
        {emails.map((email, index) => (
          <div key={index} className="email-box">
            <h2>{email.title}</h2>
            <p>{highlightWords(email.content)}</p>
            <p>{email.signature}</p>
          </div>
        ))}
      </div>
      {isImageVisible && (
        <img src={GUY_STOPPING} alt="Guy stopping" className="floating-image" />
      )}
      {showChat && (
        <div className="chat-box">
          <div className="chat-header">
            <p>{chatText}</p>
            <button className="close-chat-button" onClick={closeChatBubble}>
              X
            </button>
          </div>
          {showButton && (
            <button
              className="tell-me-more-button"
              onClick={() => setIsChatBotOpen(true)}
            >
              Tell me more
            </button>
          )}
        </div>
      )}
      {isChatBotOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h3>Security Bot</h3>
            <button
              className="close-button"
              onClick={() => setIsChatBotOpen(false)}
            >
              X
            </button>
          </div>
          <div className="chatbot-body">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <p
                  key={index}
                  className={
                    msg.sender === "user" ? "user-message" : "bot-message"
                  }
                >
                  {msg.text}
                </p>
              ))}
            </div>
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question here..."
            ></textarea>
            <button className="send-button" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emails;
