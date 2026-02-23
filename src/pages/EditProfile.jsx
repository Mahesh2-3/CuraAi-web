import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Check,
  User,
  Phone,
  Activity,
  AlertCircle,
  Droplet,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    weight: "",
    height: "",
    bloodGroup: "",
    chronic: "",
    allergies: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",
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
          name: d.name || d.fullName || "",
          phone: d.phone || "",
          dob: formattedDob,
          gender: d.gender || "",
          weight: d.weight || "",
          height: d.height || "",
          bloodGroup: d.bloodGroup || "",
          chronic: d.chronic ? d.chronic.join(", ") : "",
          allergies: d.allergies ? d.allergies.join(", ") : "",
          emergencyName: d.emergency?.name || "",
          emergencyPhone: d.emergency?.phone || "",
          emergencyRelationship: d.emergency?.relationship || "",
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
        name: formData.name,
        fullName: formData.name, // Keep for backward compatibility if needed elsewhere
        phone: formData.phone,
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        gender: formData.gender,
        weight: formData.weight,
        height: formData.height,
        bloodGroup: formData.bloodGroup,
        chronic: formData.chronic
          ? formData.chronic
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
        allergies: formData.allergies
          ? formData.allergies
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s)
          : [],
        emergency: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relationship: formData.emergencyRelationship,
        },
        updatedAt: new Date().toISOString(),
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
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-3xl w-full mx-auto">
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
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
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
                  <label className="text-sm font-medium text-zinc-400 ml-1">
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

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors [color-scheme:dark]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
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
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Physical & Medical Data */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                    />
                    <Activity
                      className="absolute left-4 top-3.5 text-zinc-400"
                      size={18}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Height (cm)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors pl-4"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Blood Group
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. O+"
                      value={formData.bloodGroup}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bloodGroup: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                    />
                    <Droplet
                      className="absolute left-4 top-3.5 text-red-500"
                      size={18}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Chronic Conditions (comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.chronic}
                    onChange={(e) =>
                      setFormData({ ...formData, chronic: e.target.value })
                    }
                    placeholder="Asthma, Diabetes..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Allergies (comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
                    placeholder="Peanuts, Penicillin..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-white mb-4 text-red-400 flex items-center gap-2">
                <AlertCircle size={20} /> Emergency Contact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Contact Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyName: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                    <Users
                      className="absolute left-4 top-3.5 text-zinc-400"
                      size={18}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyPhone: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                    <Phone
                      className="absolute left-4 top-3.5 text-zinc-400"
                      size={18}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium text-zinc-400 ml-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mother, Spouse"
                    value={formData.emergencyRelationship}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyRelationship: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm"
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
