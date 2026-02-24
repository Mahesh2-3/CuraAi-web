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
  Camera,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { uploadFileToCloudinary } from "../utils/uploadCloudinary";

export default function EditProfile() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [initialData, setInitialData] = useState(null);
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
    profileImage: "",
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    isAlert: true,
  });

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

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
        const initial = {
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
          profileImage: d.profileImage || user.photoURL || "",
        };
        setFormData(initial);
        setInitialData(initial);
      }
      setLoading(false);
    }
    fetchUser();
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const secureUrl = await uploadFileToCloudinary(file);
      if (secureUrl) {
        setFormData((prev) => ({ ...prev, profileImage: secureUrl }));

        // Auto-save the image directly into Firebase
        const ref = doc(db, "users", user.uid);
        await updateDoc(ref, {
          profileImage: secureUrl,
          updatedAt: new Date().toISOString(),
        });
        await refreshProfile();

        // Update initial data so we don't think it's dirty just because of the image
        setInitialData((prev) => ({ ...prev, profileImage: secureUrl }));

        setModalState({
          isOpen: true,
          title: "Success",
          message: "Profile image uploaded and saved successfully.",
          type: "success",
          isAlert: true,
        });
      }
    } catch {
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to upload image. Please try again.",
        type: "danger",
        isAlert: true,
      });
    } finally {
      setUploadingImage(false);
    }
  };

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
        profileImage: formData.profileImage,
        updatedAt: new Date().toISOString(),
      });
      await refreshProfile();
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Error saving profile",
        type: "danger",
        isAlert: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const isDirty =
    initialData && JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <ArrowLeft className="text-zinc-400" size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
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

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-zinc-800 bg-zinc-900 overflow-hidden shadow-lg">
                  {uploadingImage ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
                    </div>
                  ) : formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/images/defaultProfile.jpg"
                      alt="Default Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                  <div className="flex flex-col items-center text-white">
                    <Camera size={24} className="mb-1" />
                    <span className="text-xs font-semibold">Change</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

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
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
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
          </form>
        )}
      </div>

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isAlert={modalState.isAlert}
        confirmText="OK"
      />
    </div>
  );
}
