import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext";
import { useConversation } from "../context/conversationContext";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  addDoc,
} from "firebase/firestore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm"; // for tables etc
import { Send } from "lucide-react";
import ChatAttachment from "../components/ChatAttachment";

export default function Home() {
  const { activeConversationId, setActiveConversationId } = useConversation();
  const { user } = useAuth();
  const [userMsg, setUserMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================= */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* =========================
     REALTIME LISTENER
  ========================= */
  useEffect(() => {
    if (!user || !activeConversationId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(
        db,
        "users",
        user.uid,
        "conversations",
        activeConversationId,
        "messages",
      ),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        role: doc.data().role,
        message: doc.data().content,
        attachment: doc.data().attachment,
      }));
      setMessages(msgs);
      console.log(msgs);
      setTimeout(scrollToBottom, 100);
    });

    return unsubscribe;
  }, [activeConversationId, user]);

  /* =========================
     SEND MESSAGE
  ========================= */
  async function handleSend(e) {
    if (e) e.preventDefault();
    if (!user) return;
    if (!userMsg.trim()) return;

    const content = userMsg.trim();
    setUserMsg("");

    // 1. OPTIMISTIC UI UPDATE
    const tempId = `temp-${Math.random().toString(36).substring(2, 11)}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        role: "user",
        message: content,
        attachment: null,
      },
      {
        id: `loading-${tempId}`,
        role: "assistant",
        message: "AI is typing...",
        attachment: null,
        status: "loading",
      },
    ]);

    let conversationId = activeConversationId;

    // Create conversation if needed
    if (!conversationId) {
      const convoRef = doc(collection(db, "users", user.uid, "conversations"));
      await setDoc(convoRef, {
        title: content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      conversationId = convoRef.id;
      setActiveConversationId(conversationId);
    }

    const convoRef = doc(
      db,
      "users",
      user.uid,
      "conversations",
      conversationId,
    );
    const convoSnap = await getDoc(convoRef);

    if (convoSnap.exists()) {
      const data = convoSnap.data();
      if (data.title === "New Chat" && content.length > 0) {
        await setDoc(
          convoRef,
          {
            title: content.slice(0, 40),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    }

    // 2. SAVE USER MESSAGE TO FIRESTORE
    await addDoc(
      collection(
        db,
        "users",
        user.uid,
        "conversations",
        conversationId,
        "messages",
      ),
      {
        role: "user",
        content: content,
        attachment: null,
        createdAt: serverTimestamp(),
      },
    );

    // AI loading placeholder
    await addDoc(
      collection(
        db,
        "users",
        user.uid,
        "conversations",
        conversationId,
        "messages",
      ),
      {
        role: "assistant",
        content: "ai is typing....",
        status: "loading",
        createdAt: serverTimestamp(),
      },
    );

    await setDoc(convoRef, { updatedAt: serverTimestamp() }, { merge: true });

    const ipAddress =
      import.meta.env.VITE_PUBLIC_IP_ADDRESS || "http://localhost:5000";

    // Trigger AI
    fetch(`${ipAddress}/ai-response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        conversationId,
      }),
    });

    handleAnalysis();
  }

  async function handleAnalysis() {
    try {
      const ipAddress =
        import.meta.env.VITE_PUBLIC_IP_ADDRESS || "http://localhost:5000";
      fetch(`${ipAddress}/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          conversationId: activeConversationId,
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex flex-col h-full absolute inset-0">
      {!activeConversationId && messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-[#3b82f6]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(76,175,80,0.15)]">
            <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 bg-[#3b82f6] rounded-full"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent mb-2">
            How are you feeling today?
          </h2>
          <p className="text-zinc-500 text-lg">
            Describe your symptoms to get started.
          </p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 sm:w-[70%] w-full mx-auto overflow-y-auto hide-scrollbar px-4 py-6 space-y-6">
        {messages.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col w-full ${
              item.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {item.attachment && <ChatAttachment attachment={item.attachment} />}

            <div
              className={`px-5 py-3.5 mt-1 text-[15px] leading-relaxed shadow-sm ${
                item.role === "user"
                  ? "bg-[#3b82f6] text-white rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[75%]"
                  : "text-zinc-100 rounded-2xl rounded-tl-sm max-w-[95%] md:max-w-[85%]"
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

      {/* Input Area */}
      <div className="p-4 backdrop-blur">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 max-w-4xl mx-auto relative group"
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
              placeholder="Describe your symptoms (e.g., I have a cough and mild fever...)"
              className="w-full bg-transparent text-white px-4 py-3.5 max-h-32 min-h-[52px] focus:outline-none resize-none placeholder:text-zinc-500 block"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!userMsg.trim()}
            className="flex-shrink-0 bg-[#3b82f6] hover:bg-blue-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white p-3.5 rounded-2xl transition-colors shadow-sm disabled:cursor-not-allowed"
          >
            <Send
              size={20}
              className={
                userMsg.trim() ? "translate-x-0.5 -translate-y-0.5" : ""
              }
            />
          </button>
        </form>
        <p className="text-center sm:text-xs text-[10px] text-zinc-400 mt-2">
          CuraAi can make mistakes. Consider verifying medical advice with a
          professional.
        </p>
      </div>
    </div>
  );
}
