import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreateDefaultSettings,
  signUpUsingEmailAndPassword,
  saveUserData,
} from "../../lib/auth";
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

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) return (setError("Enter full name"), false);
    if (!email.trim()) return (setError("Enter email"), false);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return (setError("Invalid email"), false);
    if (password.length < 6)
      return (setError("Password must be 6+ characters"), false);
    if (password !== confirmPassword)
      return (setError("Passwords do not match"), false);
    if (!dob) return (setError("Select date of birth"), false);
    if (!gender) return (setError("Select gender"), false);
    if (!acceptedTerms)
      return (setError("You must accept the Terms and Policies"), false);
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const ipAddress =
        import.meta.env.VITE_PUBLIC_IP_ADDRESS || "http://localhost:5000";
      const response = await fetch(`${ipAddress}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");

      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to start registration");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return setError("Enter a valid 6-digit OTP");

    setError("");
    setLoading(true);

    try {
      const ipAddress =
        import.meta.env.VITE_PUBLIC_IP_ADDRESS || "http://localhost:5000";
      const response = await fetch(`${ipAddress}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");

      // 1. Firebase Auth signup
      const authRes = await signUpUsingEmailAndPassword(
        email,
        password,
        fullName,
      );

      if (!authRes.success) {
        throw new Error(authRes.error);
      }

      // 2. Save profile data to Firestore directly
      await saveUserData(authRes.data.uid, email, {
        name: fullName,
        fullName,
        phone,
        dob: new Date(dob).toISOString(),
        gender,
      });

      await CreateDefaultSettings();

      // Redirect on success to Onboarding
      navigate("/onboarding");
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

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pl-11 text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
              />
              <User
                className="absolute left-4 top-3.5 text-zinc-400"
                size={18}
              />
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
              <Mail
                className="absolute left-4 top-3.5 text-zinc-400"
                size={18}
              />
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
                onClick={() =>
                  setIsConfirmPasswordShown(!isConfirmPasswordShown)
                }
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
                placeholder="Phone Number (Optional)"
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

            {/* Terms and Policies */}
            <div className="flex items-center space-x-2 mt-4 mb-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-[#3b82f6] focus:ring-[#3b82f6] focus:ring-1"
              />
              <label htmlFor="terms" className="text-sm text-zinc-400">
                I accept the{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-[#3b82f6] hover:underline hover:text-[#2563eb]"
                >
                  Terms and Policies
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Sending Code..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-zinc-400 text-sm">
                We sent a verification code to{" "}
                <span className="text-white font-semibold">{email}</span>
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-center text-4xl tracking-[0.5em] font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
              disabled={loading}
              className="w-full bg-transparent hover:bg-zinc-700 text-zinc-400 font-medium py-3 rounded-xl transition-colors mt-2"
            >
              Back to Details
            </button>
          </form>
        )}

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

      {/* Terms and Policies Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-zinc-800 border border-zinc-700 w-full max-w-lg rounded-2xl p-6 shadow-xl max-h-[80vh] flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">
              Terms and Policies
            </h2>
            <div className="overflow-y-auto text-zinc-300 space-y-4 mb-6 pr-2">
              <p>
                Welcome to CuraAi! By accessing or using our services, you agree
                to be bound by these terms.
              </p>
              <h3 className="text-lg font-semibold text-white">
                1. Data Privacy
              </h3>
              <p>
                We respect your privacy and are committed to protecting it. Your
                medical data, chat history, and profile information are
                encrypted and not shared with any third parties without your
                explicit consent.
              </p>
              <h3 className="text-lg font-semibold text-white">
                2. Medical Disclaimer
              </h3>
              <p>
                The information provided by CuraAi is for informational purposes
                only and is not a substitute for professional medical advice,
                diagnosis, or treatment. Always seek the advice of your
                physician or other qualified health provider with any questions
                you may have regarding a medical condition.
              </p>
              <h3 className="text-lg font-semibold text-white">
                3. User Responsibilities
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password and for restricting access to your computer
                or device. You agree to accept responsibility for all activities
                that occur under your account.
              </p>
            </div>
            <div className="mt-auto flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-xl transition-colors shrink-0"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
