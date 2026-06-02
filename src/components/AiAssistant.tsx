import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Sparkles, X, Send, Bot, User, HelpCircle, Loader, RefreshCw, Layers } from "lucide-react";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SUGGESTED_QUESTIONS = [
  "Which local suppliers have the ESP32 in stock?",
  "What is the complete bill of materials to build a custom smartwatch?",
  "Recommend a low-power Bluetooth module available within 20km.",
  "What's the difference between Arduino Nano Every and Arduino Uno R4 WIFI?"
];

export default function AiAssistant({ isOpen, onClose, onOpen }: AiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: "Hello! I am your AI Sourcing Assistant. I have indexed every microcontroller, antenna, display panel, and custom casing at our 5 local product hubs. Paste a component list or ask me anything about your build!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasPulseNotification, setHasPulseNotification] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the sourcing AI");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        offline: data.offline
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("AI chat Error:", error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Oops! I encountered an issue reaching the local server. Let's try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleFloatingClick = () => {
    setHasPulseNotification(false);
    onOpen();
  };

  return (
    <>
      {/* 1. Floating AI Bubble (Bottom-Right Corner) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleFloatingClick}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-google-blue text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-blue-600 active:scale-95 cursor-pointer focus:outline-none"
          id="floating-ai-bubble"
        >
          {/* Sparkles / Notification indicator */}
          {hasPulseNotification && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-google-red opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-google-red" />
            </span>
          )}

          <div className="flex items-center justify-center">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
        </button>
      </div>

      {/* 2. Side Panel Slide-out Modal Drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all duration-300"
          id="chat-assistant-overlay"
        >
          {/* Backdrop Dismiss trigger */}
          <div className="flex-1 cursor-pointer" onClick={onClose} />

          {/* Assistant Panel Body */}
          <div 
            className="flex h-full w-full flex-col bg-white shadow-2xl md:max-w-md lg:max-w-lg transition-transform duration-300"
            id="chat-assistant-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-4">
              <div className="flex items-center space-x-2.5">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-google-blue/10">
                  <Bot className="h-5.5 w-5.5 text-google-blue" />
                </div>
                <div>
                  <h3 className="font-display leading-tight text-base font-bold text-gray-900 flex items-center space-x-1.5">
                    <span>Product AI Expert</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-google-green" />
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Within 40km proximity scanner</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Conversation area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              
              {messages.map((msg) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${!isAI ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar icon */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none ${
                      isAI 
                        ? "bg-google-blue/15 text-google-blue" 
                        : "bg-gray-100 text-gray-800 border"
                    }`}>
                      {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                    </div>

                    {/* Speech content box */}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isAI 
                        ? "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100" 
                        : "bg-google-blue text-white rounded-tr-sm"
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                      
                      <div className={`mt-1.5 flex items-center justify-between text-[10px] ${
                        isAI ? "text-gray-400" : "text-blue-200"
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isAI && msg.offline && (
                          <span className="rounded bg-yellow-50 px-1.5 py-0.5 text-google-yellow font-semibold uppercase tracking-wider font-mono">
                            Offline Native DB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-google-blue/15 text-google-blue leading-none">
                    <Loader className="h-4.5 w-4.5 animate-spin" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-400 rounded-tl-sm">
                    <span className="flex items-center space-x-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-google-blue opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-google-blue"></span>
                      </span>
                      <span className="font-medium">AI is scanning local hub stock tables...</span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Sourcing suggestion chips panel - Only show when input is empty */}
            {inputValue.trim().length === 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  Hot Product Queries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestClick(question)}
                      className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1 text-left text-xs font-medium text-gray-600 shadow-sm transition hover:border-google-blue hover:text-google-blue hover:bg-blue-50/50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Form input wrapper */}
            <div className="border-t border-gray-100 p-4 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about microcontrollers, displays, custom fab..."
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-google-blue focus:outline-none focus:ring-1 focus:ring-google-blue"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-google-blue text-white shadow-md transition-transform active:scale-95 disabled:opacity-40 disabled:scale-100"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
