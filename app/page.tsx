"use client";

import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useLocalStorage } from "@/app/youtube/youtube";

export default function YouTubeAI() {

  const [url, setUrl] = useLocalStorage<string>("url", "");
  const [prompt, setPrompt] = useLocalStorage<string>("prompt", "");
  const [language, setLanguage] = useLocalStorage<string>("language", "English");

  const [loading, setLoading] = useState<boolean>(false);

  const startGeneration = async () => {

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, language }),
      });

      const data = await res.json();

      setPrompt(data.prompt);

    } catch (err) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">

      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        YouTube AI Prompt Generator FedAI
      </h1>

      <div className="w-full max-w-2xl space-y-4">

        <input
          type="text"
          placeholder="Add Youtube Video Url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-4 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-4 rounded bg-gray-800 border border-gray-700"
        >
          <option value="English">English</option>
          <option value="Armenian">Armenian</option>
          <option value="Georgian">Georgian</option>
        </select>

        <button
          onClick={startGeneration}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded font-bold"
        >
          {loading ? "Waiting..." : "Create a prompt"}
        </button>

        {prompt && (
          <div className="mt-10 p-6 bg-gray-800 rounded-lg border border-blue-500/30">

            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Prompt:
            </h2>

            <div className="prose prose-invert max-w-none text-gray-200">
              <ReactMarkdown>{prompt}</ReactMarkdown>
            </div>


          </div>
        )}

      </div>
    </main>
  );
}