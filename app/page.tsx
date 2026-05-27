
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Bot, Trash2 } from "lucide-react";

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

      const aiMessage = {
        role: "assistant",
        content: data.reply || data.error,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // voice reply
      const speech = new SpeechSynthesisUtterance(
        data.reply || "Error"
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
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">

      <div className="w-full max-w-2xl h-[90vh] bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">

          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-2xl">
              <Bot size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                AI Voice Agent
              </h1>

              <p className="text-sm text-gray-400">
                Smart Realtime Assistant
              </p>
            </div>
          </div>

          {/* clear chat */}
          <button
            onClick={clearChat}
            className="bg-red-500 hover:bg-red-600 transition p-3 rounded-xl"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <Bot size={60} className="mb-4 opacity-60" />

              <h2 className="text-2xl font-bold mb-2">
                Welcome 👋
              </h2>

              <p>
                Start chatting with your AI assistant
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-5 py-3 rounded-3xl text-sm leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "bg-blue-500 self-end rounded-br-md"
                  : "bg-zinc-800 self-start rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {/* loading */}
          {loading && (
            <div className="bg-zinc-800 self-start px-5 py-3 rounded-3xl rounded-bl-md text-sm animate-pulse">
              AI is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* input */}
        <div className="p-4 border-t border-white/10 bg-white/5">

          <div className="flex items-center gap-3 bg-zinc-900 rounded-2xl p-2">

            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}

              // enter press send
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}

              className="flex-1 bg-transparent px-3 py-3 outline-none text-white placeholder:text-gray-500"
            />

            {/* mic */}
            <button
              onClick={startListening}
              className="bg-pink-500 hover:bg-pink-600 transition p-3 rounded-xl"
            >
              <Mic size={20} />
            </button>

            {/* send */}
            <button
              onClick={sendMessage}
              className="bg-blue-500 hover:bg-blue-600 transition p-3 rounded-xl"
            >
              <Send size={20} />
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}