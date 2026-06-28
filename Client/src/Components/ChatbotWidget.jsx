import React, { useState, useEffect, useRef, useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import axios from "axios";
import { MessageSquare, Send, X, Bot, Loader2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget() {
  const { serverURL } = useContext(TrackForgeContextAPI);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am TrackForge AI. Ask me anything about bug tickets, file uploads, project tracking, or code debugging inside the workspace!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem("userId");

  // Load chat history from database if logged in
  useEffect(() => {
    if (!userId || !serverURL) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${serverURL}/ai/chatbot/history/${userId}`);
        if (response.data.success && response.data.messages && response.data.messages.length > 0) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchChatHistory();
  }, [userId, serverURL]);

  // Alert new messages when chat is closed
  useEffect(() => {
    if (messages.length > 1 && !isOpen) {
      setHasNewMessage(true);
    }
  }, [messages.length]);

  // Handle open toggle
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Pass conversation history to backend chatbot route
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      history.push(userMessage);

      const response = await axios.post(`${serverURL}/ai/chatbot`, {
        messages: history,
        userId: userId || null // Send userId if logged in so it persists in DB
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
      }
    } catch (err) {
      console.error("Chatbot response failure:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, I encountered an error linking to the server. Please check your connection or your Groq API credentials.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helper
  const handleCopyCode = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom parser to render code blocks and text chunks beautifully
  const renderMessageContent = (content) => {
    if (!content.includes("```")) {
      return <p className="whitespace-pre-wrap break-words">{content}</p>;
    }

    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Extract language and code
        const firstLineBreak = part.indexOf("\n");
        const lang = part.substring(3, firstLineBreak).trim() || "code";
        const code = part.substring(firstLineBreak + 1, part.length - 3).trim();
        const copyId = `${index}-${lang}`;

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-default shadow-sm w-full max-w-full text-left">
            {/* Header bar of Code Block */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-905 border-b border-default text-[10px] text-secondary font-semibold uppercase font-sans">
              <span>{lang}</span>
              <button
                onClick={() => handleCopyCode(code, copyId)}
                className="flex items-center gap-1 hover:text-primary transition cursor-pointer"
              >
                {copiedId === copyId ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            {/* Code Content */}
            <pre className="bg-slate-950 text-emerald-400 p-3 font-mono text-[10px] overflow-x-auto scrollbar-thin max-w-full">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      return <p key={index} className="whitespace-pre-wrap break-words inline">{part}</p>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* 1. Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[380px] h-[520px] bg-card border border-default rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 backdrop-blur-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-default/20 bg-secondary/80 text-primary">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-neon animate-pulse" />
                <div>
                  <h4 className="text-sm font-bold leading-tight">TrackForge AI</h4>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-hover text-secondary hover:text-primary rounded-lg transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-primary/20 scrollbar-thin flex flex-col">
              {messages.map((msg, idx) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isAI ? "self-start" : "ml-auto flex-row-reverse"
                    }`}
                  >
                    {isAI && (
                      <div className="h-7 w-7 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-neon" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed max-w-full ${
                        isAI
                          ? "bg-secondary text-primary border border-default rounded-tl-none shadow-sm"
                          : "btn-gradient text-white rounded-tr-none shadow-md"
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex items-start gap-2.5 max-w-[85%] self-start animate-pulse">
                  <div className="h-7 w-7 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-neon animate-spin" />
                  </div>
                  <div className="bg-secondary text-primary border border-default rounded-2xl rounded-tl-none px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-neon" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-default/20 bg-secondary/40 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 outline-none rounded-xl px-3 py-2 bg-secondary border border-default text-primary text-xs focus:ring-1 focus:ring-[var(--border-neon)]/30 disabled:opacity-50"
                placeholder="Ask about workspace features or code..."
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 rounded-xl bg-neon hover:bg-neon/90 text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleChat}
        className="h-14 w-14 rounded-full btn-gradient text-white flex items-center justify-center shadow-xl hover:shadow-2xl cursor-pointer relative group border border-white/10"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="h-6 w-6" />
              {/* Notification Pulse Dot */}
              {hasNewMessage && (
                <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-neon border-2 border-[var(--bg-primary)] animate-pulse"></span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
