import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Check, User, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    async function fetchUser() {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        let formattedDob = "";
        if (d.dob) {
          const dateObj = new Date(d.dob);
          if (!isNaN(dateObj)) {
            formattedDob = dateObj.toISOString().split("T")[0];
          }
        }
        setFormData({
          fullName: d.fullName || "",
          phone: d.phone || "",
          dob: formattedDob,
          gender: d.gender || "",
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        fullName: formData.fullName,
        phone: formData.phone,
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        gender: formData.gender,
      });
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-400" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 ml-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                  required
                />
                <User
                  className="absolute left-4 top-3.5 text-zinc-400"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 ml-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                />
                <Phone
                  className="absolute left-4 top-3.5 text-zinc-400"
                  size={18}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors [color-scheme:light]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700 ml-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors appearance-none"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 mt-8 border-t border-zinc-700 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Check size={18} />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
