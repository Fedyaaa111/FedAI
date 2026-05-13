"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocalStorage } from "@/app/youtube/youtube";

export default function Home() {

  const [url, setUrl] = useLocalStorage<string>("url", "");
  const [language, setLanguage] = useLocalStorage<string>("language", "English");
  const [prompt, setPrompt] = useLocalStorage<string>("prompt", "");

  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, language }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setPrompt(data.prompt);

    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">

      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        YouTube AI Generator
      </h1>

      <div className="w-full max-w-2xl space-y-4">

        {/* URL */}
        <input
          className="w-full p-4 rounded bg-gray-800 text-white"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        {/* LANGUAGE */}
        <select
          className="w-full p-4 rounded bg-gray-800 text-white"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Armenian</option>
          <option>Georgian</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={generate}
          className="w-full bg-blue-600 p-4 rounded font-bold"
        >
          {loading ? "Generating..." : "Create Prompt"}
        </button>

        {/* OUTPUT */}
        {prompt && (
          <div className="mt-10 p-6 bg-gray-800 rounded-lg">

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{prompt}</ReactMarkdown>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
