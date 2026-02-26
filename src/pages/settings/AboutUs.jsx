import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile/settings"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-300" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">About Us</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Cura Ai</h2>
            <p className="text-lg text-[#3b82f6] font-medium">
              AI Healthcare for Everyone
            </p>
          </div>

          <div className="space-y-4 text-zinc-300 leading-relaxed text-sm">
            <p>
              Our app is built with a clear mission: to make quality healthcare
              guidance accessible, affordable, and available to everyone,
              anytime and anywhere.
            </p>
            <p>
              In many regions, especially rural and underserved areas, access to
              doctors is limited. Long waiting times, high costs, and lack of
              basic medical guidance prevent people from getting help when they
              need it most. This app uses Artificial Intelligence to bridge that
              gap and support users before, during, and after they seek
              professional medical care.
            </p>
            <p>
              This app does not replace doctors. It acts as a smart assistant
              that helps users understand health concerns early and take the
              right next steps.
            </p>
          </div>

          {/* Section: What This App Does */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
              What This App Does
            </h3>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-[#3b82f6] mt-1">•</span>
                <span>Provides 24×7 AI-powered health assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#3b82f6] mt-1">•</span>
                <span>Helps users understand symptoms early</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#3b82f6] mt-1">•</span>
                <span>Offers personalized health insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#3b82f6] mt-1">•</span>
                <span>Sends reminders and health summaries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#3b82f6] mt-1">•</span>
                <span>Guides users on when to consult a doctor</span>
              </li>
            </ul>
          </div>

          {/* Section: How It Works */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
              How It Works
            </h3>
            <ul className="space-y-4 text-sm text-zinc-300 counter-reset-step">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Users enter basic information such as symptoms, age, and
                  health history
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  AI analyzes the information using medically guided logic
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>Clear and easy-to-understand guidance is provided</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  Serious conditions trigger a recommendation to consult a
                  doctor
                </span>
              </li>
            </ul>
          </div>

          {/* Section: Privacy and Security */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
              Privacy and Security
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              User privacy is a top priority. Health data is securely stored and
              encrypted. User consent is always respected, and no information is
              shared without permission.
            </p>
          </div>

          {/* Section: Our Vision */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
              Our Vision
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We believe healthcare should be accessible to everyone, regardless
              of location or financial status. Our goal is to reduce inequality,
              support early medical decisions, and build a smarter healthcare
              future using technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
