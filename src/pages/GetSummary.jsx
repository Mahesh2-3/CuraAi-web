import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RefreshCw, FileText } from "lucide-react";

const TABS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "Overall", value: "overall" },
];

export default function GetSummary() {
  const [activeTab, setActiveTab] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  const checkFirebaseAndFetch = async (range, regenerate = false) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

    setLoading(true);
    setMarkdown("");

    try {
      const summaryRef = doc(db, "users", uid, "summaries", range);

      if (!regenerate) {
        const snap = await getDoc(summaryRef);

        if (snap.exists()) {
          const data = snap.data();
          const generatedAt = data.generatedAt?.toDate?.();
          const now = Date.now();

          if (generatedAt) {
            const age = now - generatedAt.getTime();
            // Fresh summary (< 2 days old)
            if (age < TWO_DAYS_MS) {
              setMarkdown(data.markdown);
              setLoading(false);
              return;
            }
          }
        }
      }

      // No summary or forced regeneration → trigger backend
      const ipAddress =
        import.meta.env.VITE_PUBLIC_IP_ADDRESS || "localhost:3000";
      await fetch(`http://${ipAddress}/get-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, param: range }),
      });

      // Poll Firebase Document
      let attempts = 0;
      while (attempts < 5) {
        await new Promise((res) => setTimeout(res, 1500));
        const retrySnap = await getDoc(summaryRef);

        if (retrySnap.exists()) {
          setMarkdown(retrySnap.data().markdown);
          setLoading(false);
          return;
        }
        attempts++;
      }

      setMarkdown(
        "⏳ **Summary is being generated. Please check again shortly.**",
      );
    } catch (error) {
      console.error(error);
      setMarkdown("❌ **Failed to load summary**");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkFirebaseAndFetch(activeTab, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRefresh = () => {
    setIsRotating(true);
    checkFirebaseAndFetch(activeTab, true);
    setTimeout(() => setIsRotating(false), 1000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
              <FileText className="text-[#3b82f6]" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent">
              Health Summary
            </h1>
          </div>
          <p className="text-zinc-400 mt-2">
            AI-generated summary of your recent conditions.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-800 border border-zinc-700 p-1.5 rounded-full shadow-sm">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                    isActive
                      ? "bg-[#3b82f6] text-white shadow-[#3b82f6]/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleRefresh}
            className="p-2.5 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-[#3b82f6] transition-colors"
            title="Regenerate Summary"
          >
            <RefreshCw
              size={20}
              className={isRotating ? "animate-spin text-[#3b82f6]" : ""}
            />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl p-6 sm:p-8 overflow-y-auto shadow-sm">
        {loading && !markdown ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500 font-medium animate-pulse">
              Analyzing your health history...
            </p>
          </div>
        ) : (
          <div
            className="prose prose-blue max-w-none 
                          prose-headings:text-white prose-h1:text-2xl prose-h2:text-xl
                          prose-p:text-zinc-700 prose-p:leading-relaxed
                          prose-li:text-zinc-700
                          prose-blockquote:border-[#3b82f6] prose-blockquote:bg-[#3b82f6]/5 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                          prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700"
          >
            <Markdown remarkPlugins={[remarkGfm]}>
              {markdown || "No summary available for this time period."}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
