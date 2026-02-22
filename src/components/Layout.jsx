import {
  Outlet,
  Navigate,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useConversation } from "../context/conversationContext";
import { sidebarOptions } from "../constants/theme";
import { LogOut, Plus, MessageSquare } from "lucide-react";
import { db } from "../lib/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Layout() {
  const { user, loading, logout } = useAuth();
  const { activeConversationId, setActiveConversationId } = useConversation();
  const location = useLocation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "conversations"),
      orderBy("updatedAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversations(data);
    });
    return unsubscribe;
  }, [user]);

  const handleNewChat = () => {
    setActiveConversationId(null);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSelectChat = (id) => {
    setActiveConversationId(id);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Sidebar for Desktop / Tablet */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-700 bg-zinc-800 shadow-sm h-full p-4 z-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent">
            CuraAi
          </h1>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pb-4">
          {sidebarOptions.map((item) => {
            const isActive =
              location.pathname === item.link ||
              (location.pathname === "/" && item.link === "/cough-analyzer");
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.link === "/cough-analyzer" ? "/" : item.link}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive && location.pathname !== "/"
                    ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                    : "text-zinc-500 hover:text-white hover:bg-zinc-700"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-zinc-700">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Recent Chats
              </span>
            </div>

            <button
              onClick={handleNewChat}
              className={`flex w-full items-center gap-3 px-3 py-3 rounded-lg transition-colors mb-2 ${
                !activeConversationId && location.pathname === "/"
                  ? "bg-[#3b82f6]/10 text-[#3b82f6] font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              }`}
            >
              <Plus size={20} />
              <span>New Chat</span>
            </button>

            <div className="space-y-1">
              {conversations.map((chat) => {
                const isActive =
                  activeConversationId === chat.id && location.pathname === "/";
                return (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive
                        ? "bg-zinc-700 text-white font-medium"
                        : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <MessageSquare size={18} className="shrink-0" />
                    <span className="truncate text-sm">
                      {chat.title || "New Chat"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-4 border-t border-zinc-700">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation Menu */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-zinc-700 bg-zinc-800/90 backdrop-blur pb-safe pt-2 px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          {sidebarOptions.map((item) => {
            const isActive =
              location.pathname === item.link ||
              (location.pathname === "/" && item.link === "/cough-analyzer");
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.link === "/cough-analyzer" ? "/" : item.link}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  isActive ? "text-[#3b82f6]" : "text-zinc-400"
                }`}
              >
                <Icon size={24} />
                <span className="text-[10px] mt-1 font-medium">
                  {item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
