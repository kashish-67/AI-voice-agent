"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Bot,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // voice input
  const startListening = () => {
    //@ts-ignore
    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
  };

  // clear chat
  const clearChat = () => {
    setMessages([]);
  };

  // send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await response.json();

      const fullText = data.reply || data.error;

      let currentText = "";

      const tempMessage = {
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, tempMessage]);

      for (let i = 0; i < fullText.length; i++) {

        currentText += fullText[i];

        await new Promise((resolve) =>
          setTimeout(resolve, 15)
        );

        setMessages((prev: any) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: currentText,
          };

          return updated;
        });
      }

      // voice reply
      const speech = new SpeechSynthesisUtterance(
        fullText
      );

      speech.lang = "en-US";

      speechSynthesis.speak(speech);

      setLoading(false);

    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] flex items-center justify-center p-4">

      <div className="w-full max-w-3xl h-[92vh] bg-white/80 backdrop-blur-2xl border border-gray-200 rounded-[35px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/60 backdrop-blur-xl">

          <div className="flex items-center gap-4">

            <div className="bg-gradient-to-r from-violet-500 to-blue-500 p-4 rounded-3xl shadow-lg">
              <Bot size={28} className="text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                AI Voice Assistant
              </h1>

              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <Sparkles size={14} />
                Smart Premium AI Experience
              </p>
            </div>
          </div>

          {/* clear */}
          <button
            onClick={clearChat}
            className="bg-red-100 hover:bg-red-200 transition p-3 rounded-2xl"
          >
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">

              <div className="bg-gradient-to-r from-violet-500 to-blue-500 p-6 rounded-full mb-6 shadow-xl">
                <Bot size={50} className="text-white" />
              </div>

              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Welcome 👋
              </h2>

              <p className="text-gray-500 text-lg max-w-md">
                Start chatting with your futuristic AI assistant
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-5 py-4 rounded-[28px] text-[15px] leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white self-end rounded-br-md"
                  : "bg-white text-gray-800 self-start rounded-bl-md border border-gray-200"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {/* loading */}
          {loading && (
            <div className="bg-white border border-gray-200 text-gray-500 self-start px-5 py-4 rounded-[28px] rounded-bl-md text-sm animate-pulse shadow-md">
              AI is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* input */}
        <div className="p-5 border-t border-gray-200 bg-white/70 backdrop-blur-xl">

          <div className="flex items-center gap-3 bg-gray-100 rounded-[24px] p-3 shadow-inner">

            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}

              className="flex-1 bg-transparent px-3 py-3 outline-none text-gray-800 placeholder:text-gray-400 text-[15px]"
            />

            {/* mic */}
            <button
              onClick={startListening}
              className="bg-pink-500 hover:bg-pink-600 transition p-4 rounded-2xl shadow-lg"
            >
              <Mic size={20} className="text-white" />
            </button>

            {/* send */}
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-violet-500 to-blue-500 hover:scale-105 transition p-4 rounded-2xl shadow-lg"
            >
              <Send size={20} className="text-white" />
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}