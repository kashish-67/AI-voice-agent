"use client";

import { useState } from "react";
import { Send, Mic } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

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

  // send message
  const sendMessage = async () => {
    if (!message) return;

    // user message add
    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

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

      console.log(data);

      // ai response add
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

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-5 shadow-2xl">

        {/* heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            🤖 AI Voice Agent
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Smart futuristic assistant
          </p>
        </div>

        {/* messages */}
        <div className="h-[400px] overflow-y-auto flex flex-col gap-3 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 self-end"
                  : "bg-gray-700 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {/* input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-zinc-800 outline-none"
          />

          {/* send button */}
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 p-4 rounded-2xl"
          >
            <Send size={22} />
          </button>

          {/* mic button */}
          <button
            onClick={startListening}
            className="bg-pink-500 hover:bg-pink-600 p-4 rounded-2xl"
          >
            <Mic size={22} />
          </button>
        </div>
      </div>
    </main>
  );
}