import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  Info,
  FileStack,
  ChevronRight,
} from "lucide-react";

export default function SupportInfo() {
  const navigate = useNavigate();
  const links = [
    {
      name: "FAQs",
      icon: HelpCircle,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      link: "/profile/settings/support-info/faqs",
    },
    {
      name: "Report a Problem",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      link: "/profile/settings/support-info/report-a-problem",
    },
    {
      name: "AI Disclaimer",
      icon: Info,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      link: "/profile/settings/support-info/ai-disclaimer",
    },
    {
      name: "Terms & Policies",
      icon: FileStack,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      link: "/profile/settings/support-info/terms-policies",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile/settings"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-300" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Support & Info</h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm divide-y divide-zinc-700 overflow-hidden mb-6">
          {links.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(link.link)}
                className="w-full flex items-center justify-between p-6 hover:bg-zinc-750 transition-colors group text-left"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 ${link.bg} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={link.color} size={20} />
                  </div>
                  <span className="font-medium text-white text-lg">
                    {link.name}
                  </span>
                </div>
                <ChevronRight
                  className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
                  size={20}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between p-6 bg-zinc-800 border border-zinc-700 rounded-2xl">
          <span className="text-lg font-medium text-white">App Version</span>
          <span className="text-lg font-medium text-zinc-300">1.0.0</span>
        </div>
      </div>
    </div>
  );
}
