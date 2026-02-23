import {
  ArrowLeft,
  Shield,
  Cpu,
  HelpCircle,
  HardDrive,
  Settings as SettingsIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const sections = [
    {
      title: "General",
      items: [
        {
          label: "About Us",
          icon: HelpCircle,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          path: "/profile/settings/about-us",
        },
        {
          label: "Support Info",
          icon: HelpCircle,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          path: "/profile/settings/support-info",
        },
      ],
    },
    {
      title: "Preferences & Privacy",
      items: [
        {
          label: "AI Behavior",
          icon: Cpu,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          path: "/profile/settings/ai-behavior",
        },
        {
          label: "Data Control",
          icon: HardDrive,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          path: "/profile/settings/data-control",
        },
        {
          label: "Permissions",
          icon: Shield,
          color: "text-red-500",
          bg: "bg-red-500/10",
          path: "/profile/settings/permissions",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/profile"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="text-zinc-400" size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
              <SettingsIcon className="text-[#3b82f6]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 ml-2">
                {section.title}
              </h2>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-sm overflow-hidden divide-y divide-zinc-100">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center group-hover:bg-zinc-800 group-hover:shadow-sm transition-all`}
                        >
                          <Icon className={item.color} size={20} />
                        </div>
                        <span className="font-medium text-white">
                          {item.label}
                        </span>
                      </div>
                      <ArrowLeft
                        className="text-zinc-300 transform rotate-180"
                        size={18}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
