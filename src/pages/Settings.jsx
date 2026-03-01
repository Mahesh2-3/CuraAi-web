import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Cpu,
  HelpCircle,
  HardDrive,
  Settings as SettingsIcon,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || !passwordConfirm) return;
    setIsDeleting(true);

    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordConfirm,
      );
      await reauthenticateWithCredential(user, credential);

      // Tell backend to delete account in Firestore and Firebase Auth
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/delete-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete account on the server");
      }

      // Cleanup local state and navigate away
      logout();
      navigate("/login");
    } catch (error) {
      alert(
        error.message === "Firebase: Error (auth/invalid-credential)."
          ? "Incorrect password."
          : "An error occurred while deleting your account.",
      );
    } finally {
      setIsDeleting(false);
      setPasswordConfirm("");
    }
  };

  const sections = [
    {
      title: "General",
      items: [
        {
          label: "About Us",
          icon: HelpCircle,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          path: "/profile/settings/about-us",
        },
        {
          label: "Support Info",
          icon: HelpCircle,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          path: "/profile/settings/support-info",
        },
        {
          label: "FAQs",
          icon: HelpCircle,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          path: "/profile/settings/support-info/faqs",
          isInner: true,
        },
        {
          label: "Report a Problem",
          icon: HelpCircle,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          path: "/profile/settings/support-info/report-a-problem",
          isInner: true,
        },
        {
          label: "AI Disclaimer",
          icon: HelpCircle,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          path: "/profile/settings/support-info/ai-disclaimer",
          isInner: true,
        },
        {
          label: "Terms & Policies",
          icon: HelpCircle,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          path: "/profile/settings/support-info/terms-policies",
          isInner: true,
        },
      ],
    },
    {
      title: "Preferences & Privacy",
      items: [
        {
          label: "AI Behavior",
          icon: Cpu,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          path: "/profile/settings/ai-behavior",
        },
        {
          label: "Data Control",
          icon: HardDrive,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          path: "/profile/settings/data-control",
        },
        {
          label: "Manage Conversations",
          icon: HardDrive,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          path: "/profile/settings/data-control/conversations",
          isInner: true,
        },
        {
          label: "Manage Diseases",
          icon: HardDrive,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          path: "/profile/settings/data-control/diseases",
          isInner: true,
        },
        {
          label: "Manage Summary",
          icon: HardDrive,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          path: "/profile/settings/data-control/summary",
          isInner: true,
        },
        {
          label: "Permissions",
          icon: Shield,
          color: "text-red-500",
          bg: "bg-red-500/10",
          path: "/profile/settings/permissions",
        },
      ],
    },
  ];

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const matchesSearch = item.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        if (searchQuery.trim() === "") {
          return !item.isInner;
        }
        return matchesSearch;
      }),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-4 md:p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-8">
          <Link
            to="/profile"
            className="w-8 h-8 md:w-10 md:h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="text-zinc-300 w-4 h-4 md:w-5 md:h-5" />
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center shrink-0">
              <SettingsIcon className="text-[#3b82f6] w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Settings
            </h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
          />
          <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
        </div>

        <div className="space-y-8">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 ml-2">
                  {section.title}
                </h2>
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm overflow-hidden divide-y divide-zinc-100">
                  {section.items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center group-hover:bg-zinc-800 group-hover:shadow-sm transition-all`}
                          >
                            <Icon className={item.color} size={20} />
                          </div>
                          <span className="font-medium text-white">
                            {item.label}
                          </span>
                        </div>
                        <ArrowLeft
                          className="text-zinc-300 transform rotate-180"
                          size={18}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-8">
              No settings found matching "{searchQuery}"
            </div>
          )}

          {/* Delete Account Section */}
          <div className="pt-4 border-t border-zinc-700/50">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-colors group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-all">
                  <span className="text-red-500 font-bold">!</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-red-500">
                    Delete Account
                  </span>
                  <span className="text-xs text-red-400/80">
                    Permanently delete your data
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">
              Delete Account
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              This action cannot be undone. All your conversations, history, and
              profile data will be permanently removed. To confirm, please enter
              your password.
            </p>

            <input
              type="password"
              placeholder="Enter your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 mb-6 text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!passwordConfirm || isDeleting}
                className="flex-1 flex justify-center items-center bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
