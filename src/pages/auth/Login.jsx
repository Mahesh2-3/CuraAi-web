import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import {
  listenToAuthChanges,
  signInUsingEmailAndPassword,
} from "../../lib/auth";
import { Mail, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- AUTH LISTENER ---------- */
  useEffect(() => {
    const unsubscribe = listenToAuthChanges(async (authUser) => {
      if (authUser) {
        navigate("/"); // Redirect to home if logged in
      }
    });

    return unsubscribe;
  }, [navigate]);

  /* ---------- VALIDATION ---------- */
  const validateForm = () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setError("Please enter your password");
      return false;
    }
    return true;
  };

  /* ---------- SIGN IN ---------- */
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      const res = await signInUsingEmailAndPassword(email, password);
      if (!res.success) throw new Error(res.error);

      navigate("/");
    } catch (err) {
      // Simplify error mapping
      switch (err.message) {
        case "Firebase: Error (auth/user-not-found).":
        case "auth/user-not-found":
          setError("Email not registered. Please sign up.");
          break;
        case "Firebase: Error (auth/wrong-password).":
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        default:
          setError("Sign in failed. Check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent mb-2">
            CuraAi
          </h1>
          <p className="text-zinc-300">Welcome back! Sign in to continue.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
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

          <div className="relative">
            <input
              type={isPasswordShown ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-300 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              className="absolute right-4 top-3.5 text-zinc-300 hover:text-white transition-colors"
            >
              {isPasswordShown ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-[0_4px_14px_0_rgba(76,175,80,0.39)]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#3b82f6] hover:text-[#2563eb] font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
