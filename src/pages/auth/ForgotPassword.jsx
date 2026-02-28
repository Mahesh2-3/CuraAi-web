import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Please enter a valid email");
    }

    setError("");
    setLoading(true);

    try {
      const ipAddress = import.meta.env.VITE_SERVER_URL;
      const response = await fetch(`${ipAddress}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");

      setStep(2);
      setSuccessMsg("Verification code sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp || otp.length < 6) return setError("Enter a valid 6-digit OTP");
    if (newPassword.length < 6)
      return setError("Password must be 6+ characters");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);

    try {
      const ipAddress = import.meta.env.VITE_SERVER_URL;
      const response = await fetch(`${ipAddress}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp,
          newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to reset password");

      setSuccessMsg("Password reset successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-900 px-4 py-12">
      <div className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-zinc-300">
            {step === 1
              ? "Enter your email to receive a verification code."
              : "Enter the verification code and your new password."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg p-3 mb-6 text-sm">
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-300 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                required
              />
              <Mail
                className="absolute right-4 top-3.5 text-zinc-300"
                size={20}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="6-digit Verification Code (OTP)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.25em] font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={isPasswordShown ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-300 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordShown(!isPasswordShown)}
                className="absolute right-4 top-3.5 text-zinc-300 hover:text-white transition-colors"
              >
                {isPasswordShown ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={isConfirmPasswordShown ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-300 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setIsConfirmPasswordShown(!isConfirmPasswordShown)
                }
                className="absolute right-4 top-3.5 text-zinc-300 hover:text-white transition-colors"
              >
                {isConfirmPasswordShown ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setSuccessMsg("");
              }}
              disabled={loading}
              className="w-full bg-transparent hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors mt-2"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-zinc-300">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-[#3b82f6] hover:text-[#2563eb] font-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
