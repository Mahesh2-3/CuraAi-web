import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, ArrowLeft, Activity } from "lucide-react";

export default function DiseaseChat() {
  const { id } = useParams();
  const { user } = useAuth();

  const [diseaseTitle, setDiseaseTitle] = useState("Loading...");
  const [messages, setMessages] = useState([]);
  const [userMsg, setUserMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch disease details for the header
  useEffect(() => {
    async function fetchDiseaseInfo() {
      if (!user || !id) return;
      try {
        const docRef = doc(db, "users", user.uid, "diseases", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setDiseaseTitle(snap.data().diseaseName || "Disease Chat");
        } else {
          setDiseaseTitle("Chat");
        }
      } catch (error) {
        console.error("Error fetching disease info:", error);
      }
    }
    fetchDiseaseInfo();
  }, [id, user]);

  // Realtime messages fetch
  useEffect(() => {
    if (!user || !id) return;

    const q = query(
      collection(db, "users", user.uid, "diseases", id, "chat"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        role: doc.data().role,
        message: doc.data().content,
      }));
      setMessages(list);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    return unsubscribe;
  }, [id, user]);

  async function handleSend(e) {
    if (e) e.preventDefault();
    if (!user || !userMsg.trim() || !id) return;

    const content = userMsg.trim();
    setUserMsg("");
    setSending(true);

    // Optimistic UI for quick feedback
    const tempId = `temp-${Math.random().toString(36).substr(2, 9)}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", message: content },
      {
        id: `loading-${tempId}`,
        role: "assistant",
        message: "AI is typing...",
        status: "loading",
      },
    ]);

    try {
      // Save User Message
      await addDoc(collection(db, "users", user.uid, "diseases", id, "chat"), {
        role: "user",
        content: content,
        createdAt: serverTimestamp(),
      });

      // AI Loading Placeholder
      await addDoc(collection(db, "users", user.uid, "diseases", id, "chat"), {
        role: "assistant",
        content: "ai is typing....",
        status: "loading",
        createdAt: serverTimestamp(),
      });

      const ipAddress = import.meta.env.VITE_SERVER_URL;

      // Trigger AI
      fetch(`${ipAddress}/disease-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          diseaseId: id,
        }),
      });
    } catch (err) {
      console.error("SEND ERROR:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-4 bg-zinc-800 border-b border-zinc-700 px-4 md:px-8 py-4 shrink-0 shadow-sm z-10">
        <Link
          to={`/diseases/${id}`}
          className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="text-zinc-300" size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
            <Activity className="text-[#3b82f6]" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white truncate max-w-xs md:max-w-md">
            {diseaseTitle}
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 max-w-5xl w-full mx-auto overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center flex-1 justify-center text-center mt-20 opacity-60">
              <Activity size={48} className="text-[#3b82f6] mb-4 opacity-50" />
              <p className="text-zinc-500 font-medium">No messages yet.</p>
              <p className="text-zinc-300 text-sm max-w-xs mt-2">
                Ask questions about your condition or request recommendations.
              </p>
            </div>
          )}

          {messages.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col w-full ${
                item.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-5 py-3.5 mt-1 text-[15px] leading-relaxed shadow-sm ${
                  item.role === "user"
                    ? "bg-[#3b82f6] text-white rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[75%]"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-2xl rounded-tl-sm max-w-[95%] md:max-w-[85%]"
                }`}
              >
                {item.role === "user" ? (
                  <p className="whitespace-pre-wrap">{item.message}</p>
                ) : (
                  <div className="prose prose-invert prose-blue max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {item.message
                        ? item.message.replace(/\\([#*_\-`>![\]()])/g, "$1")
                        : ""}
                    </Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 backdrop-blur">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 max-w-4xl mx-auto relative group"
        >
          <div className="flex-1 bg-zinc-800 border border-zinc-700 focus-within:border-[#3b82f6] focus-within:ring-1 focus-within:ring-[#3b82f6] rounded-2xl transition-all shadow-sm">
            <textarea
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask anything about this condition..."
              className="w-full bg-transparent text-white px-4 py-3.5 max-h-32 min-h-[52px] focus:outline-none resize-none placeholder:text-zinc-500 block"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!userMsg.trim() || sending}
            className="flex-shrink-0 bg-[#3b82f6] hover:bg-blue-600 disabled:bg-zinc-200 disabled:text-zinc-300 text-white p-3.5 rounded-2xl transition-colors shadow-sm disabled:cursor-not-allowed"
          >
            <Send
              size={20}
              className={
                userMsg.trim() && !sending
                  ? "translate-x-0.5 -translate-y-0.5"
                  : ""
              }
            />
          </button>
        </form>
      </div>
    </div>
  );
}
