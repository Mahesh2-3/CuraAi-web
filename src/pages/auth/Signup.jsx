import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreateDefaultSettings,
  signUpUsingEmailAndPassword,
} from "../../lib/auth";
import { functions } from "../../lib/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import { User, Mail, Eye, EyeOff, Phone, Calendar } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(""); // Native date string YYYY-MM-DD
  const [gender, setGender] = useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!fullName.trim()) return (setError("Enter full name"), false);
    if (!email.trim()) return (setError("Enter email"), false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return (setError("Invalid email"), false);
    if (password.length < 6)
      return (setError("Password must be 6+ characters"), false);
    if (password !== confirmPassword)
      return (setError("Passwords do not match"), false);
    if (!phone.trim()) return (setError("Enter phone number"), false);
    if (!dob) return (setError("Select date of birth"), false);
    if (!gender) return (setError("Select gender"), false);
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      // 1. Firebase Auth signup
      const authRes = await signUpUsingEmailAndPassword(
        email,
        password,
        fullName,
      );

      if (!authRes.success) {
        throw new Error(authRes.error);
      }

      // 2. Send extra profile data to server (Cloud Callable Function)
      const completeProfile = httpsCallable(functions, "completeUserProfile");

      await completeProfile({
        phone,
        dob: new Date(dob).toISOString(),
        gender,
      });

      await CreateDefaultSettings();

      // Redirect on success
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-lg bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent mb-2">
            Join CuraAi
          </h1>
          <p className="text-zinc-400">Create an account to get started.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
            />
            <User className="absolute left-4 top-3.5 text-zinc-400" size={18} />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
            />
            <Mail className="absolute left-4 top-3.5 text-zinc-400" size={18} />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={isPasswordShown ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-white transition-colors"
            >
              {isPasswordShown ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={isConfirmPasswordShown ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
              className="absolute right-4 top-3.5 text-zinc-400 hover:text-white transition-colors"
            >
              {isConfirmPasswordShown ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
            />
            <Phone
              className="absolute left-4 top-3.5 text-zinc-400"
              size={18}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB Picker (Native Browser Picker) */}
            <div className="relative">
              <input
                type="date"
                value={dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors [color-scheme:light]"
              />
            </div>

            {/* Gender Dropdown */}
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors appearance-none"
              >
                <option value="" disabled className="text-zinc-500">
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#3b82f6] hover:text-[#2563eb] font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
