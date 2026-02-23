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
import { LogOut, Plus, MessageSquare, Settings, Menu, X } from "lucide-react";
import { db } from "../lib/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function Layout() {
  const { user, profile, loading, logout } = useAuth();
  const { activeConversationId, setActiveConversationId } = useConversation();
  const location = useLocation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    setActiveConversationId(id);
    if (location.pathname !== "/") {
      navigate("/");
    }
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed flex flex-col w-64 border-r border-zinc-700 bg-zinc-800 shadow-sm h-full p-4 z-30 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 w-full">
            <Link
              to="/profile"
              onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
              className="shrink-0"
            >
              <img
                src={
                  profile?.profileImage ||
                  user.photoURL ||
                  "/images/defaultProfile.jpg"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border border-zinc-600 object-cover hover:opacity-80 transition-opacity"
              />
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent">
              CuraAi
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col overflow-hidden h-full">
          {/* Main Menu Items */}
          <div className="space-y-1 shrink-0">
            {sidebarOptions.map((item) => {
              const isActive = location.pathname === item.link;
              console.log(location.pathname, item.link);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.link}
                  onClick={() =>
                    window.innerWidth < 768 && setIsSidebarOpen(false)
                  }
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#3b82f6]/10 text-[#3b82f6]"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-700"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Chat History Block (Taking remaining height visually via flex) */}
          <div className="flex flex-col mt-4 pt-4 border-t border-zinc-700 flex-1 overflow-hidden shrink-0">
            <button
              onClick={handleNewChat}
              className={`flex shrink-0 w-full items-center justify-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-2 ${
                !activeConversationId && location.pathname === "/"
                  ? "bg-[#3b82f6]/10 text-[#3b82f6] font-medium"
                  : "text-zinc-400 hover:text-white bg-zinc-700"
              }`}
            >
              <Plus size={20} />
              <span className="text-sm">New Chat</span>
            </button>
            <div className="flex shrink-0 items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Recent Chats
              </span>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto hide-scrollbar pb-2">
              {conversations.map((chat) => {
                const isActive =
                  activeConversationId === chat.id && location.pathname === "/";
                return (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left shrink-0 ${
                      isActive
                        ? "bg-zinc-700 text-white font-medium"
                        : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    <MessageSquare size={16} className="shrink-0" />
                    <span className="truncate text-xs">
                      {chat.title || "New Chat"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-3 border-t border-zinc-700 shrink-0">
          <Link
            to="/profile/settings"
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
            className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mb-1 ${
              location.pathname.startsWith("/profile/settings")
                ? "bg-zinc-700 text-white"
                : "text-zinc-500 hover:text-white hover:bg-zinc-700"
            }`}
          >
            <Settings size={20} />
            <span className="font-medium text-sm">Settings</span>
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 relative flex flex-col h-screen overflow-hidden transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Main Content Header for Global Toggle Button (Mobile/Desktop logic for hidden sidebar) */}
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white shadow-md border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
