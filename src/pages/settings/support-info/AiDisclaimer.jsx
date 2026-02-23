import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function AiDisclaimer() {
  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile/settings/support-info"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-400" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">AI Disclaimer</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 md:p-8 shadow-sm text-zinc-300 space-y-8">
          <p className="text-lg leading-relaxed text-white">
            This application uses Artificial Intelligence (AI) to provide
            general health-related information and guidance. The information
            provided is intended for educational and informational purposes
            only.
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              Not a Medical Professional
            </h2>
            <p className="leading-relaxed text-sm">
              The AI used in this app is not a medical professional and does not
              provide medical diagnoses, treatments, or prescriptions. This app
              does not replace doctors, nurses, or other qualified healthcare
              professionals.
            </p>
          </section>

          <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
            <h2 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle size={20} /> Medical Emergencies
            </h2>
            <p className="leading-relaxed text-sm text-red-300">
              If you are experiencing a medical emergency, severe symptoms, or a
              life-threatening condition, seek immediate medical attention or
              contact your local emergency services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              AI Limitations
            </h2>
            <p className="leading-relaxed text-sm">
              AI-generated responses are based on the information provided by
              the user and may be incomplete, inaccurate, or unsuitable for
              certain individuals. Health conditions vary widely, and the AI may
              not consider all possible risks or complications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              User Responsibility
            </h2>
            <p className="leading-relaxed text-sm">
              Users are responsible for their own health decisions. Any actions
              taken based on information provided by this app are done at the
              user’s own discretion and risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed text-sm">
              The developers of this app are not liable for any harm, loss, or
              damages resulting from the use or misuse of AI-generated
              information provided through this application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">Data Usage</h2>
            <p className="leading-relaxed text-sm">
              User data is processed securely and used only to generate
              personalized guidance, in accordance with our Privacy Policy.
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-700 text-center">
            <p className="text-sm font-medium text-white">
              By using this application, you acknowledge and agree to this AI
              Disclaimer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
