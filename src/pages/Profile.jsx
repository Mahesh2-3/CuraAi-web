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
  Droplet,
  Phone,
  AlertCircle,
  Calendar,
} from "lucide-react";

const calculateAge = (dob) => {
  if (!dob) return "N/A";
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

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
    <div className="flex flex-col h-full bg-zinc-900 p-4 md:p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-8">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center shrink-0">
            <User className="text-[#3b82f6] w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-white">
              Profile
            </h1>
            <p className="text-zinc-300 text-sm md:text-base">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm mb-6 flex items-start sm:items-center gap-6 flex-col sm:flex-row">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 border-2 border-zinc-700 overflow-hidden">
            <img
              src={
                userData?.profileImage ||
                user?.photoURL ||
                "/images/defaultProfile.jpg"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <h2 className="text-xl font-bold text-white truncate">
              {userData?.name || userData?.fullName || "Loading..."}
            </h2>
            <p className="text-zinc-300 truncate mb-4">{user?.email}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Age
                </span>
                <p className="text-sm text-white font-medium flex items-center gap-2">
                  <Calendar size={14} className="text-[#3b82f6]" />{" "}
                  {calculateAge(userData?.dob)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Gender
                </span>
                <p className="text-sm text-white font-medium flex items-center gap-2">
                  <User size={14} className="text-[#3b82f6]" />{" "}
                  {userData?.gender || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Weight
                </span>
                <p className="text-sm text-white font-medium flex items-center gap-2">
                  {userData?.weight ? `${userData.weight} kg` : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  Height
                </span>
                <p className="text-sm text-white font-medium flex items-center gap-2">
                  {userData?.height ? `${userData.height} cm` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Medical Info */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-[#3b82f6]" /> Medical
              Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-zinc-300 block mb-1">
                  Blood Group
                </span>
                <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-blue-600 font-medium">
                  <Droplet size={16} />{" "}
                  {userData?.bloodGroup || "Not specified"}
                </div>
              </div>
              <div>
                <span className="text-sm text-zinc-300 block mb-1">
                  Chronic Conditions
                </span>
                <div className="flex flex-wrap gap-2">
                  {userData?.chronic?.length > 0 ? (
                    userData.chronic.map((condition, idx) => (
                      <span
                        key={idx}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-white"
                      >
                        {condition}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 text-sm italic">
                      None specified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-zinc-300 block mb-1">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-2">
                  {userData?.allergies?.length > 0 ? (
                    userData.allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="bg-red-500/10 border border-red-500/20 text-red-100 rounded-lg px-3 py-1 text-sm"
                      >
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-500 text-sm italic">
                      None specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm divide-y divide-zinc-700 overflow-hidden mb-6">
          <Link
            to="/profile/edit"
            className="flex items-center justify-between p-5 hover:bg-zinc-700/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center group-hover:bg-zinc-600 transition-all">
                <Edit3
                  className="text-zinc-300 group-hover:text-white"
                  size={20}
                />
              </div>
              <span className="font-medium text-white">Edit Profile</span>
            </div>
            <ChevronRight
              className="text-zinc-300 group-hover:text-white"
              size={20}
            />
          </Link>

          <Link
            to="/profile/settings"
            className="flex items-center justify-between p-5 hover:bg-zinc-700/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center group-hover:bg-zinc-600 transition-all">
                <Settings
                  className="text-zinc-300 group-hover:text-white"
                  size={20}
                />
              </div>
              <span className="font-medium text-white">Settings</span>
            </div>
            <ChevronRight
              className="text-zinc-300 group-hover:text-white"
              size={20}
            />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-5 hover:bg-red-500/10 transition-colors group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                <LogOut className="text-red-500" size={20} />
              </div>
              <span className="font-medium text-red-500">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
