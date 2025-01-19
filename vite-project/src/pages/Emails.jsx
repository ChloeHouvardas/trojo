import React, { useState, useEffect } from "react";
import axios from "axios"; // Install axios for API calls: npm install axios
import "./Emails.css"; // Import the CSS file
import GUY_STOPPING from "../assets/GUY_STOPPING.png"; // Adjust the path

const Emails = () => {
  const [emails, setEmails] = useState([
    {
      title: "finances@canada.ca",
      content: `Thanks for working with us. Your bill for $373.75 was due on 28 Dec 2023.

If you've already paid it, please ignore this email and sorry for bothering you. If you've not paid for it, please do so as soon as possible.

View your bill here

If you've got any questions, or want to arrange an alternative payment method please don't hesitate to contact us.

Thanks,

RR Limited`,
      signature: "Best regards,\nTeam",
      flaggedWords: [],
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
      flaggedWords: [],
    },
    {
      title: "UPS Notification",
      content: `YOUR PACKAGE IS COMING
You have (1) package waiting for delivery. Use your code to track it and receive it. Schedule your delivery and subscribe to our push notifications to avoid this from happening again!

SCHEDULE YOUR DELIVERY

Track all your shipments in one place. Keep us close at hand!
Tracking Code: 1013992`,
      signature: "UPS Delivery Team",
      flaggedWords: [],
    },
    {
      title: "Follow up on your Real Canadian Superstore application",
      content: `Thank you for your interest in joining Loblaw! We truly appreciate the time and effort you’ve put into your application. We are in the process of transitioning to a new application system to better serve our candidates and make applying easier. Our new system includes a recruitment assistant, Alex, who will guide you through the application process and provide real-time support.

If you are still interested in pursuing a role with us, we kindly ask that you reapply after Monday, January 20th through our Career site on this link.

We sincerely appreciate your understanding during this transition and look forward to reconnecting with you soon. Thank you again for your interest in Loblaw, and we look forward to hearing from you again!`,
      signature: "Thank you,\nOperations Manager",
      flaggedWords: [],
    },
  ]);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatText, setChatText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const additionalWords = ["as soon as possible", "Team", "Loblaw", "Push notifications, unexpected message, Team Lead", "SCHEDULE YOUR DELIVERY", "YOUR PACKAGE IS COMING", "just reply", "recruitment assistant"];
  const message = "Phew, that was a close one";

  // Fetch flagged words for each email
  useEffect(() => {
    const scanEmails = async () => {
      setLoading(true);
      const updatedEmails = await Promise.all(
        emails.map(async (email) => {
          try {
            const response = await axios.post("http://localhost:5000/scan", {
              email_content: email.content,
            });
            const combinedFlaggedWords = [
              ...new Set([
                ...response.data.flagged_words,
                ...additionalWords,
              ]),
            ];
            return { ...email, flaggedWords: combinedFlaggedWords };
          } catch (error) {
            console.error("Error scanning email:", error);
            return { ...email, flaggedWords: additionalWords };
          }
        })
      );
      setEmails(updatedEmails);
      setLoading(false);
    };

    scanEmails();
  }, []);

  useEffect(() => {
    if (isImageVisible) {
      const chatTimeout = setTimeout(() => {
        setShowChat(true);
        let currentText = "";
        let index = 0;

        const typeInterval = setInterval(() => {
          currentText += message[index];
          setChatText(currentText);
          index++;

          if (index >= message.length) {
            clearInterval(typeInterval);
            setShowButton(true);
          }
        }, 100);
      }, 2000);

      return () => clearTimeout(chatTimeout);
    } else {
      setShowChat(false);
      setChatText("");
      setShowButton(false);
    }
  }, [isImageVisible]);

  const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const highlightWords = (text, flaggedWords) => {
    if (!flaggedWords.length) return text;

    const regex = new RegExp(`(${flaggedWords.map(escapeRegex).join("|")})`, "gi");

    return text.split(regex).map((word, index) => {
      if (flaggedWords.some((fw) => fw.toLowerCase() === word.toLowerCase())) {
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

    setChatMessages([...chatMessages, { sender: "user", text: chatInput }]);

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: chatInput,
      });
      const botResponse = response.data.response;

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

    setChatInput("");
  };

  const closeChatBubble = () => {
    setIsImageVisible(false);
    setShowChat(false);
    setChatText("");
    setShowButton(false);
    setIsChatBotOpen(false);
  };

  return (
    <div className="emails-container">
      <h1 className="emails-header">Trojo</h1>
      {loading && <p className="loading">Scanning emails for phishing indicators...</p>}
      <div className="email-list">
        {emails.map((email, index) => (
          <div key={index} className="email-box">
            <h2>{email.title}</h2>
            <p>{highlightWords(email.content, email.flaggedWords)}</p>
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
            <h3>Trojo Talk</h3>
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