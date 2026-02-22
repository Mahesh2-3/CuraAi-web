import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import {
  User,
  Settings,
  Edit3,
  LogOut,
  ChevronRight,
  Activity,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setUserData(doc.data());
    });
    return unsubscribe;
  }, [user]);

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
            <User className="text-[#3b82f6]" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <p className="text-zinc-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-[#3b82f6]/20 rounded-full flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-[#3b82f6] uppercase">
              {userData?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">
              {userData?.fullName || "Loading..."}
            </h2>
            <p className="text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Options */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm divide-y divide-zinc-100 overflow-hidden">
          <Link
            to="/profile/edit"
            className="flex items-center justify-between p-5 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center group-hover:bg-zinc-800 group-hover:shadow-sm transition-all">
                <Edit3 className="text-zinc-400" size={20} />
              </div>
              <span className="font-medium text-white">Edit Profile</span>
            </div>
            <ChevronRight className="text-zinc-400" size={20} />
          </Link>

          <Link
            to="/profile/settings"
            className="flex items-center justify-between p-5 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center group-hover:bg-zinc-800 group-hover:shadow-sm transition-all">
                <Settings className="text-zinc-400" size={20} />
              </div>
              <span className="font-medium text-white">Settings</span>
            </div>
            <ChevronRight className="text-zinc-400" size={20} />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-800 group-hover:shadow-sm transition-all">
                <LogOut className="text-red-500" size={20} />
              </div>
              <span className="font-medium text-red-600">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
