import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ_DATA = [
  {
    question: "What does this app do?",
    answer:
      "This app provides AI-powered health guidance to help you better understand your symptoms and health-related questions. It is designed to offer general information and support, not a medical diagnosis.",
  },
  {
    question: "Is this app a replacement for a doctor?",
    answer:
      "No. This app does not replace a qualified medical professional. Always consult a doctor for diagnosis, treatment, or serious health concerns.",
  },
  {
    question: "How accurate is the information provided?",
    answer:
      "The information is generated using AI models trained on medical and health-related knowledge. While we aim for accuracy, AI responses may not always be correct or complete.",
  },
  {
    question: "What data does the app collect?",
    answer:
      "We may collect basic profile information, symptoms you enter, and app usage data. This data is used only to improve your experience and is stored securely.",
  },
  {
    question: "Is my health data safe?",
    answer:
      "Yes. We use standard security practices to protect your data. We do not sell or share your personal or health data without your consent.",
  },
  {
    question: "What should I do in a medical emergency?",
    answer:
      "If you are experiencing a medical emergency, do not rely on this app. Please contact your doctor or local emergency services immediately.",
  },
  {
    question: "Can I delete my data?",
    answer:
      "Yes. You can request to access or delete your data at any time from the app settings.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h1 className="text-2xl font-bold text-white">FAQs</h1>
        </div>

        <div className="space-y-4 mb-8">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-zinc-750"
                >
                  <span className="font-semibold text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-zinc-300 text-sm leading-relaxed border-t border-zinc-700 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-zinc-500 mb-8">
          Still have questions? Contact support from the app settings.
        </p>
      </div>
    </div>
  );
}
