
"use client";

import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState<
    { role: string; text: string }[]
  >([]);

  async function sendMessage(text?: string) {
    const finalMessage = text || message;

    if (!finalMessage) return;

    setChat((prev) => [
      ...prev,
      { role: "user", text: finalMessage },
    ]);

    setMessage("");

    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: finalMessage,
      }),
    });

    const data = await res.json();

    setChat((prev) => [
      ...prev,
      {
        role: "assistant",
        text: data.reply,
      },
    ]);

    const speech = new SpeechSynthesisUtterance(data.reply);
    speechSynthesis.speak(speech);

    setLoading(false);
  }

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;

      setMessage(text);

      sendMessage(text);
    };

    recognition.start();
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-center mb-2">
          🤖 AI Voice Agent
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Smart futuristic assistant
        </p>

        <div className="h-[400px] overflow-y-auto space-y-4 mb-6 pr-2">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-500"
                    : "bg-white/10 border border-white/20"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-400 animate-pulse">
              AI is thinking...
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-white/10 border border-white/20 outline-none"
          />

          <button
            onClick={() => sendMessage()}
            className="bg-blue-500 hover:bg-blue-600 transition p-4 rounded-2xl"
          >
            <Send size={22} />
          </button>

          <button
            onClick={startListening}
            className="bg-pink-500 hover:bg-pink-600 transition p-4 rounded-2xl"
          >
            <Mic size={22} />
          </button>
        </div>
      </motion.div>
    </main>
  );
}