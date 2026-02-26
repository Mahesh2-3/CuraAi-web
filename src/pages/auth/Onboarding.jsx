import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { db } from "../../lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Activity, Droplet, AlertCircle, Phone } from "lucide-react";

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bloodGroup: "",
    chronic: "",
    allergies: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/");

    setLoading(true);
    try {
      const ref = doc(db, "users", user.uid);

      const chronicArray = formData.chronic
        ? formData.chronic
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const allergiesArray = formData.allergies
        ? formData.allergies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      await updateDoc(ref, {
        height: formData.height,
        weight: formData.weight,
        bloodGroup: formData.bloodGroup,
        chronic: chronicArray,
        allergies: allergiesArray,
        updatedAt: new Date().toISOString(),
      });

      await refreshProfile();
      navigate("/");
    } catch (error) {
      console.error("Failed to update onboarding profile", error);
    } finally {
      setLoading(false);
    }
  };

  const skipOnboarding = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-lg bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent mb-2">
            Almost There!
          </h1>
          <p className="text-zinc-300">
            Tell CuraAi about your health profile so we can provide better
            insights.
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Height */}
            <div className="relative">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="height"
                  placeholder="e.g. 175"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                />
                <Activity
                  className="absolute left-4 top-3.5 text-zinc-300"
                  size={18}
                />
              </div>
            </div>

            {/* Weight */}
            <div className="relative">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  placeholder="e.g. 70"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                />
                <Activity
                  className="absolute left-4 top-3.5 text-zinc-300"
                  size={18}
                />
              </div>
            </div>
          </div>

          {/* Blood Group */}
          <div className="relative">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Blood Group
            </label>
            <div className="relative">
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors appearance-none"
              >
                <option value="" disabled className="text-zinc-500">
                  Select Blood Group
                </option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ),
                )}
              </select>
              <Droplet
                className="absolute left-4 top-3.5 text-zinc-300"
                size={18}
              />
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="relative">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Chronic Conditions (comma separated)
            </label>
            <div className="relative">
              <input
                type="text"
                name="chronic"
                placeholder="e.g. Asthma, Diabetes"
                value={formData.chronic}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
              />
              <AlertCircle
                className="absolute left-4 top-3.5 text-zinc-300"
                size={18}
              />
            </div>
          </div>

          {/* Allergies */}
          <div className="relative">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Allergies (comma separated)
            </label>
            <div className="relative">
              <input
                type="text"
                name="allergies"
                placeholder="e.g. Peanuts, Penicillin"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
              />
              <AlertCircle
                className="absolute left-4 top-3.5 text-zinc-300"
                size={18}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>

          <button
            type="button"
            onClick={skipOnboarding}
            disabled={loading}
            className="w-full bg-transparent border border-zinc-700 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors mt-3"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
