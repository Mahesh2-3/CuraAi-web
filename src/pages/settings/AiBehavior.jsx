import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useAuth } from "../../context/authContext";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const defaultBehavior = {
  responseStyle: "detailed_and_explanatory",
  medicalStrictness: "balanced",
  followUpQuestions: "ask_more",
  language: "English",
};

export default function AiBehavior() {
  const { user } = useAuth();

  const [aiBehavior, setAiBehavior] = useState(defaultBehavior);
  const [originalBehavior, setOriginalBehavior] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "settings", "preferences");
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().aiBehavior) {
        setAiBehavior(snap.data().aiBehavior);
        setOriginalBehavior(snap.data().aiBehavior);
      } else {
        setOriginalBehavior(defaultBehavior);
      }
    }
    loadSettings();
  }, [user]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(aiBehavior) !== JSON.stringify(originalBehavior);
  }, [aiBehavior, originalBehavior]);

  const handleSave = async () => {
    if (!hasChanges || !user) return;
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid, "settings", "preferences");
      await updateDoc(ref, { aiBehavior });
      setOriginalBehavior(aiBehavior);
    } catch (err) {
      console.error("Failed to save AI behavior:", err);
      // Fallback if document doesn't exist might need setDoc with merge, but updateDoc should work if initialized
    } finally {
      setSaving(false);
    }
  };

  if (!originalBehavior) {
    return (
      <div className="flex justify-center p-12 bg-zinc-900 h-full w-full">
        <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-2xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/profile/settings"
              className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="text-zinc-400" size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">AI Behavior</h1>
          </div>

          <button
            disabled={!hasChanges || saving}
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              hasChanges
                ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
            {!saving && <Check size={16} />}
          </button>
        </div>

        <div className="space-y-6">
          {/* Response Style */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">
              Response Style
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "detailed_and_explanatory",
                  label: "Detailed & Explanatory",
                },
                { id: "short_and_direct", label: "Short & Direct" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      aiBehavior.responseStyle === opt.id
                        ? "border-[#3b82f6]"
                        : "border-zinc-500 group-hover:border-zinc-400"
                    }`}
                  >
                    {aiBehavior.responseStyle === opt.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                    )}
                  </div>
                  <span className="text-zinc-300">{opt.label}</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={aiBehavior.responseStyle === opt.id}
                    onChange={() =>
                      setAiBehavior({ ...aiBehavior, responseStyle: opt.id })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Medical Strictness */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">
              Medical Strictness
            </h2>
            <div className="space-y-3">
              {[
                { id: "conservative", label: "Conservative (Suggest Doctor)" },
                { id: "balanced", label: "Balanced" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      aiBehavior.medicalStrictness === opt.id
                        ? "border-[#3b82f6]"
                        : "border-zinc-500 group-hover:border-zinc-400"
                    }`}
                  >
                    {aiBehavior.medicalStrictness === opt.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                    )}
                  </div>
                  <span className="text-zinc-300">{opt.label}</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={aiBehavior.medicalStrictness === opt.id}
                    onChange={() =>
                      setAiBehavior({
                        ...aiBehavior,
                        medicalStrictness: opt.id,
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Follow-up Questions */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">
              Follow-up Questions
            </h2>
            <div className="space-y-3">
              {[
                { id: "ask_more", label: "Ask more questions" },
                { id: "off", label: "Don’t ask follow-ups" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      aiBehavior.followUpQuestions === opt.id
                        ? "border-[#3b82f6]"
                        : "border-zinc-500 group-hover:border-zinc-400"
                    }`}
                  >
                    {aiBehavior.followUpQuestions === opt.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                    )}
                  </div>
                  <span className="text-zinc-300">{opt.label}</span>
                  <input
                    type="radio"
                    className="hidden"
                    checked={aiBehavior.followUpQuestions === opt.id}
                    onChange={() =>
                      setAiBehavior({
                        ...aiBehavior,
                        followUpQuestions: opt.id,
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">
              Language Preference
            </h2>
            <select
              value={aiBehavior.language}
              onChange={(e) =>
                setAiBehavior({ ...aiBehavior, language: e.target.value })
              }
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors appearance-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
