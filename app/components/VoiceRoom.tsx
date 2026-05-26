"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";

export default function VoiceRoom() {
  const [token, setToken] = useState("");
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

  useEffect(() => {
    async function getToken() {
      const res = await fetch("/api/token");
      const data = await res.json();
      setToken(data.token);
    }

    getToken();
  }, []);

  if (!token) return <p>Loading voice room...</p>;

  return (
    <div style={{ height: "100vh" }}>
      <LiveKitRoom serverUrl={url} token={token} connect={true}>
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}