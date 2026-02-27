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
import {
  LogOut,
  Plus,
  MessageSquare,
  Settings,
  Menu,
  X,
  Trash2,
} from "lucide-react";
import { db } from "../lib/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";

export default function Layout() {
  const { user, profile, loading } = useAuth();
  const { activeConversationId, setActiveConversationId } = useConversation();
  const location = useLocation();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  useEffect(() => {
    let prevWidth = window.innerWidth;
    const handleResize = () => {
      const currWidth = window.innerWidth;
      if (currWidth >= 768 && prevWidth < 768) {
        setIsSidebarOpen(true);
      } else if (currWidth < 768 && prevWidth >= 768) {
        setIsSidebarOpen(false);
      }
      prevWidth = currWidth;
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
      setConversationsLoading(false);
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

  const handleDeleteChat = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setChatToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteChat = async () => {
    if (!user || !chatToDelete) return;

    try {
      if (activeConversationId === chatToDelete) {
        setActiveConversationId(null);
        if (location.pathname !== "/") {
          navigate("/");
        }
      }
      await deleteDoc(
        doc(db, "users", user.uid, "conversations", chatToDelete),
      );
    } catch (error) {
    } finally {
      setChatToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-zinc-900 text-white overflow-hidden relative">
        {/* Skeleton Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-zinc-700 bg-zinc-800 shadow-sm h-full p-4 z-30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-zinc-700 animate-pulse" />
            <div className="h-6 w-24 bg-zinc-700 rounded animate-pulse" />
          </div>
          <div className="space-y-2 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-full bg-zinc-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-zinc-700">
            <div className="h-10 w-full bg-zinc-700 rounded-lg animate-pulse mb-2" />
            <div className="h-14 w-full bg-zinc-700 rounded-lg animate-pulse" />
          </div>
        </aside>

        {/* Skeleton Main Content */}
        <main className="flex-1 relative flex flex-col h-screen overflow-hidden p-6 lg:p-10">
          <div className="max-w-4xl w-full mx-auto space-y-6">
            <div className="h-8 w-1/3 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-32 w-full bg-zinc-800 rounded-xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-20 w-3/4 bg-zinc-800 rounded-xl animate-pulse" />
              <div className="h-40 w-full bg-zinc-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </main>
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
            <img
              src={"/images/logo.png"}
              alt="logo"
              className="w-10 h-10 rounded-full border border-zinc-600 object-cover hover:opacity-80 transition-opacity"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent">
              CuraAi
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col overflow-hidden h-full">
          {/* Main Menu Items */}
          <div className="space-y-1 shrink-0">
            {sidebarOptions.map((item) => {
              const isActive = location.pathname === item.link;
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
                  : "text-zinc-300 hover:text-white bg-zinc-700"
              }`}
            >
              <Plus size={20} />
              <span className="text-sm">New Chat</span>
            </button>
            <div className="flex shrink-0 items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Recent Chats
              </span>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto hide-scrollbar pb-2">
              {conversationsLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800/50 animate-pulse"
                    >
                      <div className="w-4 h-4 rounded bg-zinc-700 shrink-0" />
                      <div className="h-3 bg-zinc-700 rounded w-full" />
                    </div>
                  ))}
                </>
              ) : (
                conversations.map((chat) => {
                  const isActive =
                    activeConversationId === chat.id &&
                    location.pathname === "/";
                  return (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`group flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left shrink-0 ${
                        isActive
                          ? "bg-zinc-700 text-white font-medium"
                          : "text-zinc-500 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      <MessageSquare size={16} className="shrink-0" />
                      <span className="truncate text-xs flex-1">
                        {chat.title || "New Chat"}
                      </span>
                      <div
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all p-1 rounded hover:bg-red-500/10 shrink-0"
                        title="Delete chat"
                      >
                        <Trash2 size={14} />
                      </div>
                    </button>
                  );
                })
              )}
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
          <Link
            to="/profile"
            onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg hover:bg-zinc-700 transition-colors w-full"
          >
            <img
              src={
                profile?.profileImage ||
                user.photoURL ||
                "/images/defaultProfile.jpg"
              }
              alt="Profile"
              className="w-10 h-10 rounded-full border border-zinc-600 object-cover shrink-0"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium text-sm text-white truncate">
                {profile?.name ||
                  profile?.fullName ||
                  user?.displayName ||
                  "User"}
              </span>
              <span className="text-xs text-zinc-500 truncate">
                {user?.email}
              </span>
            </div>
          </Link>
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
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white shadow-md border border-zinc-700 hover:bg-zinc-700 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </div>
      </main>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setChatToDelete(null);
        }}
        onConfirm={confirmDeleteChat}
        title="Delete Chat"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </div>
  );
}
