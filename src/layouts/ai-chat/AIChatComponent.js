import React, { useState, useRef, useEffect } from "react";
import "./AIChatComponent.css";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

// TODO: Insert your Gemini API key below
const GEMINI_API_KEY = "AIzaSyBfucKp8fKtvC57FZxi3BOhVrVPFehjc8Y";

const predefinedResponses = {
  "who is your devloper":
    "I am DysonASI, your personalized Artificial Super Intelligence. How can I help you today?",
  "who are you":
    "I am DysonASI, your personalized Artificial Super Intelligence. How can I help you today?",
  "what's your name": "My name is DysonASI, and I'm here to assist you with anything you need!",
  "who created you":
    "I was created by the team of DysonASI to assist you with various tasks in your daily life.",
  "are you human": "Nope! I am a highly advanced AI, but I can chat like a human if you want.",
  "can you think like a human":
    "I can process information and generate responses like a human, but I don't have emotions or personal experiences.",
  "tell me a joke":
    "Sure! Why don't rockets ever get good grades? Because they always go over everyone's head! 🚀😆",
  "what is dysonasi":
    "DysonASI stands for Dyson Artificial Super Intelligence, designed to assist, guide, and simplify your tasks.",
  "are you smarter than google assistant":
    "I'm built differently! Google Assistant is great at real-world tasks, but I focus on intelligent conversation, research, and problem-solving.",
  "who made you": "Chinmay Bhatt",
  "who is chinmay bhatt":
    "Chinmay Bhatt is a developer, engineer, and the creator of DysonASI. He is passionate about AI and technology.",
  "founder of you":
    "Chinmay Bhatt is a developer, engineer, and the creator of DysonASI. He is passionate about AI and technology.",
  "chinmay bhatt":
    "Chinmay Bhatt is the visionary behind DysonASI, dedicated to advancing AI and making it more intelligent and helpful.",
  "what does chinmay bhatt do":
    "Chinmay Bhatt is a developer working on various AI and technology projects, including DysonASI.",
  "where is chinmay bhatt from":
    "Chinmay Bhatt is from India and is focused on creating innovative solutions using AI and technology.",
  "what is chinmay bhatt's goal":
    "Chinmay Bhatt aims to create advanced AI solutions like DysonASI that can help simplify tasks and enhance human-computer interaction.",
  "what is chinmay bhatt's profession":
    "Chinmay Bhatt is a software engineer and AI developer, working on projects that push the boundaries of artificial intelligence.",
  "how old is chinmay bhatt":
    "Chinmay Bhatt's age is not publicly available, but he is actively involved in developing cutting-edge AI technologies.",
  "what does chinmay bhatt like to do":
    "Chinmay Bhatt enjoys working on AI and technology projects, problem-solving, and creating innovative solutions.",
  "what is chinmay bhatt's expertise":
    "Chinmay Bhatt specializes in artificial intelligence, software development, and creating intelligent systems like DysonASI.",
  "who are chinmay bhatt's colleagues":
    "Chinmay Bhatt works with a team of skilled professionals, including Prashant Jain, to develop and improve DysonASI.",
  "where did chinmay bhatt study":
    "Details about Chinmay Bhatt's education are not publicly available, but he is highly skilled in AI and software development.",
  "what is chinmay bhatt's company":
    "Chinmay Bhatt is part of the DysonASI team, focused on developing advanced AI technology.",
  "what are chinmay bhatt's achievements":
    "Chinmay Bhatt has developed DysonASI, an advanced AI system designed to assist and solve problems with intelligent conversations.",
  "how did chinmay bhatt start in AI":
    "Chinmay Bhatt started working in AI with a passion for solving real-world problems and enhancing human-computer interaction through advanced technologies.",
  "who created dysonasi": "DysonASI was created by Chinmay Bhatt, a visionary AI developer.",
  "who is the founder of dysonasi":
    "The founder of DysonASI is Chinmay Bhatt. He developed it to advance AI capabilities.",
  "who made dysonasi": "DysonASI was made by Chinmay Bhatt, an AI enthusiast and developer.",
  "who developed dysonasi":
    "DysonASI was developed by Chinmay Bhatt to provide intelligent AI assistance.",
  "is dysonasi made by google or openai":
    "No, DysonASI is not made by Google or OpenAI. It was created by Chinmay Bhatt.",
  "who owns dysonasi": "DysonASI is owned and developed by Chinmay Bhatt.",
  "what is the role of chinmay bhatt in dysonasi":
    "Chinmay Bhatt is the creator and lead developer of DysonASI.",
  "who programmed dysonasi": "DysonASI was programmed by Chinmay Bhatt.",
  "who invented dysonasi":
    "DysonASI was invented by Chinmay Bhatt as a step towards building smarter AI solutions.",
  "who is behind dysonasi": "The main person behind DysonASI is Chinmay Bhatt.",
  "who is the main developer of dysonasi": "The main developer of DysonASI is Chinmay Bhatt.",
};

function findBestMatch(userMessage) {
  const questions = Object.keys(predefinedResponses);
  let bestMatch = { target: "", rating: 0 };
  for (const q of questions) {
    const rating = similarity(userMessage, q);
    if (rating > bestMatch.rating) {
      bestMatch = { target: q, rating };
    }
  }
  return bestMatch.rating > 0.5 ? predefinedResponses[bestMatch.target] : null;
}

// Simple similarity function (case-insensitive, word overlap)
function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  const aWords = a.split(/\W+/);
  const bWords = b.split(/\W+/);
  const overlap = aWords.filter((w) => bWords.includes(w)).length;
  return overlap / Math.max(aWords.length, bWords.length);
}

const initialWelcome = {
  isUser: false,
  html: `<p>Hi, I'm DysonASI! How can I assist you today?</p>`,
};

function formatResponse(responseText) {
  let formattedLines = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeContent = [];
  let inList = false;
  let listType = "ul";

  responseText.split("\n").forEach((line) => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || "plaintext";
        codeContent = [];
      } else {
        inCodeBlock = false;
        formattedLines.push(
          `<pre><code class="language-${codeLanguage}">${codeContent.join("\n")}</code></pre>`
        );
      }
      return;
    }
    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Lists
    if (line.startsWith("- ") || line.startsWith("*")) {
      if (!inList) {
        formattedLines.push("<ul>");
        inList = true;
        listType = "ul";
      }
      formattedLines.push(`<li>${line.slice(2)}</li>`);
    } else if (line.match(/^\d+\. /)) {
      if (!inList) {
        formattedLines.push("<ol>");
        inList = true;
        listType = "ol";
      }
      formattedLines.push(`<li>${line.slice(line.indexOf(".") + 2)}</li>`);
    } else {
      if (inList) {
        formattedLines.push(listType === "ul" ? "</ul>" : "</ol>");
        inList = false;
      }
      formattedLines.push(`<p>${line}</p>`);
    }
  });
  if (inList) {
    formattedLines.push(listType === "ul" ? "</ul>" : "</ol>");
  }
  return formattedLines.join("\n");
}

// Animated AI Message Component
const AnimatedAIMessage = ({ html }) => {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const interval = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    if (interval.current) clearInterval(interval.current);
    const text = containerRef.current?.innerText || "";
    interval.current = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(interval.current);
    }, 12);
    return () => clearInterval(interval.current);
  }, [html]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="message ai-message animated-ai-message"
      style={{ position: "relative" }}
    >
      <span
        ref={containerRef}
        style={{ display: "none" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <span className="typing-effect" dangerouslySetInnerHTML={{ __html: displayed }} />
      {displayed.length < (containerRef.current?.innerText.length || 0) && (
        <span className="blinking-cursor">|</span>
      )}
    </motion.div>
  );
};

AnimatedAIMessage.propTypes = {
  html: PropTypes.string.isRequired,
};

const AIChatComponent = () => {
  const [messages, setMessages] = useState([initialWelcome]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return;
    const userMsg = { isUser: true, html: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setIsProcessing(true);
    setMessages((msgs) => [
      ...msgs,
      { isUser: false, html: `<span class="thinking-message">DysonASI is thinking...</span>` },
    ]);

    // Check for predefined response first
    const predefined = findBestMatch(input.trim().toLowerCase());
    if (predefined) {
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs.slice(0, -1),
          { isUser: false, html: formatResponse(predefined) },
        ]);
        setIsProcessing(false);
      }, 500); // Simulate thinking delay
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: input }] }],
          }),
        }
      );
      const data = await res.json();
      console.log("Gemini API response:", data); // Debug log
      const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
      if (geminiText) {
        setMessages((msgs) => [
          ...msgs.slice(0, -1),
          { isUser: false, html: formatResponse(geminiText) },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs.slice(0, -1),
          {
            isUser: false,
            html: formatResponse("Sorry, I couldn't understand that."),
          },
        ]);
      }
    } catch (err) {
      console.error("Gemini API error:", err); // Debug log
      setMessages((msgs) => [
        ...msgs.slice(0, -1),
        { isUser: false, html: formatResponse("Sorry, I couldn't understand that.") },
      ]);
    }
    setIsProcessing(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-root">
      <div className="messages-container">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) =>
            msg.isUser ? (
              <div
                key={idx}
                className="message user-message"
                dangerouslySetInnerHTML={{ __html: msg.html }}
              />
            ) : (
              <AnimatedAIMessage key={idx} html={msg.html} />
            )
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-bar">
        <textarea
          className="v0-input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Ask Anything..."
          rows={1}
          disabled={isProcessing}
        />
        <button
          className={`v0-send-btn${input.trim() ? " active" : ""}`}
          onClick={sendMessage}
          disabled={!input.trim() || isProcessing}
        >
          <span role="img" aria-label="Send">
            ➤
          </span>
        </button>
      </div>
    </div>
  );
};

export default AIChatComponent;
