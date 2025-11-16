import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, Volume2, VolumeX,
  User, Bot, Minimize2, Maximize2, X
} from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { ChatMessage } from '../../types/chatbot';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../lib/analytics';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

// ---------------------------------------------------
// 🔗 BACKEND — DigitalOcean API Endpoint
// ---------------------------------------------------
const BACKEND_URL = "https://seal-app-mb4q3.ondigitalocean.app/api/chat";

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    content: "Hi! I'm Farhan's AI assistant. Ask me anything about his skills, projects, or experience.",
    role: 'assistant',
    timestamp: new Date(),
    quickReplies: ["Hire Farhan", "View Portfolio", "Contact"]
  }]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '' });
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { speak, speaking } = useSpeechSynthesis();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-speak last message
  useEffect(() => {
    if (!isSpeakingEnabled) return;
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (last && !speaking) {
      try { speak({ text: last.content }); } catch {}
    }
  }, [messages, isSpeakingEnabled]);

  // Fix mobile keyboard overlap
  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const handler = () => {
      setTimeout(() => {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    };

    inputEl.addEventListener('focus', handler);
    return () => inputEl.removeEventListener('focus', handler);
  }, []);

  // ---------------------------------------------------
  // 🔥 CONNECTED TO DIGITALOCEAN BACKEND
  // ---------------------------------------------------
  const callBackend = async (userMessage: string) => {
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      return await response.json();
    } catch (error) {
      return {
        response:
          "Oops! The server isn't responding right now. Try again in a moment or contact Farhan directly.",
        quickReplies: ["Hire Farhan", "Portfolio", "Contact"]
      };
    }
  };

  // ---------------------------------------------------
  // ✉️ Send Message
  // ---------------------------------------------------
  const handleSendMessage = async (text?: string) => {
    const messageContent =
      typeof text !== "undefined" ? text : inputValue.trim();

    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: messageContent,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    analytics.track("message_sent", {
      message_length: userMessage.content.length
    });

    try {
      // Lead capture trigger
      const connectKeywords = [
        "hire",
        "contact",
        "connect",
        "work together",
        "collaborate",
        "project"
      ];

      if (
        connectKeywords.some(k =>
          userMessage.content.toLowerCase().includes(k)
        ) &&
        !leadCaptured
      ) {
        setShowLeadForm(true);
      }

      // 🟣 CALL DO BACKEND
      const result = await callBackend(messageContent);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        role: "assistant",
        timestamp: new Date(),
        quickReplies: result.quickReplies ?? []
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (isSpeakingEnabled && !speaking) {
        try { speak({ text: result.response }); } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------
  // 🎤 Voice Input
  // ---------------------------------------------------
  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => (prev ? `${prev} ${transcript}` : transcript));
    };

    try {
      recognition.start();
    } catch {}
  };

  // ---------------------------------------------------
  // 📩 Lead Form Submit
  // ---------------------------------------------------
  const handleLeadSubmit = async () => {
    if (!leadForm.name.trim() || !leadForm.email.trim()) return;

    try {
      const { error } = await supabase.from("leads").insert({
        name: leadForm.name,
        email: leadForm.email,
        source: "chatbot",
        messages: messages
          .filter(m => m.role === "user")
          .map(m => m.content)
      });

      if (error) throw error;

      setLeadCaptured(true);
      setShowLeadForm(false);
      setLeadForm({ name: "", email: "" });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Thank you ${leadForm.name}! I've saved your information — Farhan will follow up soon.`,
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    } catch {}
  };

  if (!isOpen) return null;

  const minimizedClasses =
    "fixed bottom-3 right-3 w-80 h-16 rounded-t-2xl z-50";
  const maximizedClasses =
    "fixed bottom-3 right-3 sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[75vh] w-[90vw] h-[65vh] z-50 rounded-t-2xl";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`${isMinimized ? minimizedClasses : maximizedClasses}`}
        ref={containerRef}
      >
        <div className="w-full h-full rounded-2xl shadow-2xl backdrop-blur-xl border flex flex-col bg-white dark:bg-slate-800 transition-colors duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                  Kabir's AI Assistant
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Online • Powered by DO Backend
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSpeakingEnabled(prev => !prev)}
                aria-pressed={isSpeakingEnabled}
                title="Toggle Speak Responses"
                className={`p-2 rounded-lg transition-colors ${
                  isSpeakingEnabled
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                {isSpeakingEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setIsMinimized(prev => !prev)}
                title={isMinimized ? "Maximize" : "Minimize"}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={onClose}
                title="Close chat"
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.25 }}
                      className={`flex gap-2 ${
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div className="max-w-[85%] p-3 rounded-2xl bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-white">
                        <div
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: (msg.content || "").replace(
                              /\n/g,
                              "<br/>"
                            )
                          }}
                        />
                        <p className="text-xs mt-1 opacity-60 text-right">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>

                        {msg.quickReplies &&
                          msg.quickReplies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {msg.quickReplies.map(
                                (reply: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      handleSendMessage(reply)
                                    }
                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs transition"
                                  >
                                    {reply}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                      </div>

                      {msg.role === "user" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-2.5 sm:p-3 md:p-4 border-t border-gray-200/50 dark:border-slate-700 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e =>
                    setInputValue(e.target.value)
                  }
                  onKeyPress={e =>
                    e.key === "Enter" &&
                    handleSendMessage()
                  }
                  placeholder="Ask me anything..."
                  className="flex-1 p-3 rounded-xl border bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition dark:bg-slate-700 dark:text-white"
                />

                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-xl border ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-500 hover:text-white transition-colors dark:bg-slate-700 dark:text-white`}
                  title="Voice input"
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatWindow;
