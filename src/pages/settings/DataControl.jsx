import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Activity,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function DataControl() {
  const navigate = useNavigate();

  const links = [
    {
      name: "Conversation History",
      icon: MessageSquare,
      path: "/profile/settings/data-control/conversations",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      name: "Diseases History",
      icon: Activity,
      path: "/profile/settings/data-control/diseases",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      name: "Summary",
      icon: FileText,
      path: "/profile/settings/data-control/summary",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
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
            <ArrowLeft className="text-zinc-400" size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">
            History & Data Control
          </h1>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm divide-y divide-zinc-700 overflow-hidden">
          {links.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(link.path)}
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
      </div>
    </div>
  );
}
