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
      title: "finances@canada.ca",
      content: `Thanks for working with us. Your bill for $373.75 was due on 28 Dec 2023.

If you've already paid it, please ignore this email and sorry for bothering you. If you've not paid for it, please do so as soon as possible.

View your bill here

If you've got any questions, or want to arrange an alternative payment method please don't hesitate to contact us.

Thanks,

RR Limited`,
      signature: "Best regards,\nTeam",
    },
    {
      title: "riya@brandsetmediaa.com",
      content: `Dear Chloe Houvardas,

Hope you’re doing great! Apologies for the unexpected message—I promise to keep this short.

If you’re thinking about upgrading your website or starting fresh, we’re here to help. At our agency, we don’t just make websites that look amazing.

We build sites that attract more leads, boost revenue, and help businesses grow.

Best part? We keep it affordable without sacrificing quality. 

If you'd like to see examples, just reply, and I’ll send over our portfolio.

Looking forward to helping your business grow online!`,
      signature: "Best,\nTeam Lead",
    },
    {
      title: "UPS Notification",
      content: `YOUR PACKAGE IS COMING
  You have (1) package waiting for delivery. Use your code to track it and receive it. Schedule your delivery and subscribe to our push notifications to avoid this from happening again!
  
  SCHEDULE YOUR DELIVERY
  
  Track all your shipments in one place. Keep us close at hand!
  Tracking Code: 1013992`,
  "signature": "UPS Delivery Team"
},

{
  "title": "Follow up on your Real Canadian Superstore application",
  "content": `Thank you for your interest in joining Loblaw! We truly appreciate the time and effort you’ve put into your application. We are in the process of transitioning to a new application system to better serve our candidates and make applying easier. Our new system includes a recruitment assistant, Alex, who will guide you through the application process and provide real-time support.

  If you are still interested in pursuing a role with us, we kindly ask that you reapply after Monday, January 20th through our Career site on this link.

  We sincerely appreciate your understanding during this transition and look forward to reconnecting with you soon. Thank you again for your interest in Loblaw, and we look forward to hearing from you again!`,
      signature: "Thank you,\nOperations Manager",
    },
  ];

  return (
    <div className="emails-container">
      <h1 className="emails-header">Trojo</h1>
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
