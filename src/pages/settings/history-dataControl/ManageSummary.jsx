import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, Trash2 } from "lucide-react";
import { useAuth } from "../../../context/authContext";
import { db } from "../../../lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const summaryOptions = [
  { id: "chat", label: "Using chat data" },
  { id: "diseases", label: "Using diseases data" },
  { id: "chat_and_diseases", label: "Using chat & diseases data" },
];

export default function ManageSummary() {
  const { user } = useAuth();
  const [mode, setMode] = useState("chat");
  const [expanded, setExpanded] = useState(null);
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const prefRef = doc(db, "users", user.uid, "settings", "preferences");
        const snap = await getDoc(prefRef);
        if (snap.exists() && snap.data().summary?.mode) {
          setMode(snap.data().summary.mode);
        }
      } catch (err) {
        console.error("Failed to load summary preferences", err);
      }
    };

    const loadSummaries = async () => {
      const keys = ["7d", "30d", "overall"];
      const result = {};

      for (const key of keys) {
        const ref = doc(db, "users", user.uid, "summaries", key);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          result[key] = snap.data();
        }
      }
      setSummaries(result);
    };

    // Load in parallel
    loadSummaries();
    loadPreferences();
  }, [user]);

  // Update mode in Firebase when it changes
  useEffect(() => {
    if (!user) return;
    const updateMode = async () => {
      try {
        await updateDoc(doc(db, "users", user.uid, "settings", "preferences"), {
          "summary.mode": mode,
        });
      } catch (err) {
        console.error("Failed to update summary mode preference", err);
      }
    };
    updateMode();
  }, [mode, user]);

  const deleteSummary = async (key) => {
    if (!user) return;
    if (
      !window.confirm("This summary will be permanently deleted. Are you sure?")
    )
      return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "summaries", key));
      setSummaries((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    } catch (err) {
      console.error("Error deleting summary:", err);
      alert("Failed to delete summary.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile/settings/data-control"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="text-zinc-400" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Summary</h1>
        </div>

        {/* Mode Preference */}
        <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Summary Mode</h2>
          <div className="space-y-3">
            {summaryOptions.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    mode === opt.id
                      ? "border-[#3b82f6]"
                      : "border-zinc-500 group-hover:border-zinc-400"
                  }`}
                >
                  {mode === opt.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                  )}
                </div>
                <span className="text-zinc-300 font-medium">{opt.label}</span>
                <input
                  type="radio"
                  className="hidden"
                  checked={mode === opt.id}
                  onChange={() => setMode(opt.id)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Summaries List */}
        <div className="space-y-4">
          {["7d", "30d", "overall"].map((key) => {
            const data = summaries[key];
            if (!data) return null;

            const isExpanded = expanded === key;
            const title =
              key === "7d"
                ? "Last 7 Days"
                : key === "30d"
                  ? "Last 30 Days"
                  : "Overall Summary";

            return (
              <div
                key={key}
                className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : key)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-zinc-750"
                >
                  <span className="font-semibold text-white text-lg">
                    {title}
                  </span>
                  <ChevronDown
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>

                {isExpanded && (
                  <div className="p-5 border-t border-zinc-700 bg-zinc-850/50">
                    <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {data.markdown
                          ? data.markdown.replace(/\\([#*_\-`>![\]()])/g, "$1")
                          : ""}
                      </Markdown>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => deleteSummary(key)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={18} />
                        Delete Summary
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(summaries).length === 0 && (
          <div className="text-center py-10 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm">
            <p className="text-zinc-500 font-medium">
              No summaries generated yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
