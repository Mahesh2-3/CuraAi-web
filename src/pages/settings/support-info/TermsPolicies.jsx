import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsPolicies() {
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
          <h1 className="text-2xl font-bold text-white">Terms & Policies</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
          <p className="text-lg leading-relaxed text-zinc-300 border-b border-zinc-700 pb-6">
            By using this application, you agree to the following Terms and
            Policies. Please read them carefully.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">
              1. Terms & Conditions
            </h2>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                This application provides AI-generated health-related
                information for educational and informational purposes only. The
                content provided by the app should not be considered
                professional medical advice.
              </p>
              <p>
                You agree to use this app responsibly and not misuse the
                information provided. We reserve the right to update, modify, or
                discontinue any part of the app at any time.
              </p>
              <p>
                We are not responsible for any decisions made based on the
                information provided by this app.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Privacy Policy</h2>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                Your privacy is important to us. We collect only the information
                required to provide better health guidance and improve app
                functionality.
              </p>
              <p>
                The data collected may include profile details, symptoms entered
                by you, and app usage data. All data is stored securely using
                industry-standard protection methods.
              </p>
              <p>
                We do not sell or share your personal or health data without
                your consent, except when required by law.
              </p>
              <p>You may access, update, or delete your data at any time.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">
              3. Medical Disclaimer
            </h2>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                This app does not replace professional medical consultation,
                diagnosis, or treatment. Always consult a qualified healthcare
                provider before making health-related decisions.
              </p>
              <p className="text-red-400 font-medium bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                In case of a medical emergency, contact your doctor or local
                emergency services immediately.
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-zinc-700 text-center">
            <p className="text-sm font-medium text-zinc-300">
              Continued use of this app means you accept these Terms & Policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
