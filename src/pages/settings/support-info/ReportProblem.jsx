import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

export default function ReportProblem() {
  const [issue, setIssue] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the report to a backend/Firebase
    console.log("Reporting problem:", { issue, details });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-5xl w-full mx-auto flex flex-col items-center justify-center text-center mt-20">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <Send size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Report Submited
          </h2>
          <p className="text-zinc-300 mb-8">
            Thank you for bringing this to our attention. Our team will look
            into it.
          </p>
          <Link
            to="/profile/settings/support-info"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-750 text-white rounded-xl font-medium transition-colors"
          >
            Back to Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile/settings/support-info"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-300" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Report a Problem</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm space-y-6"
        >
          <p className="text-zinc-300 text-sm">
            Describe the issue you're facing. Your feedback helps us improve the
            app.
          </p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">
              What went wrong?
            </label>
            <select
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors appearance-none"
            >
              <option value="" disabled>
                Select an issue category
              </option>
              <option value="bug">Bug or Glitch</option>
              <option value="content">Inaccurate AI Information</option>
              <option value="account">Account or Login Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300 ml-1">
              Details
            </label>
            <textarea
              required
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Send size={18} />
            <span>Submit Report</span>
          </button>
        </form>
      </div>
    </div>
  );
}
