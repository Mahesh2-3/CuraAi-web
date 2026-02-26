import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, MessageSquare, Activity } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function DiseaseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [diseaseData, setDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;

    const fetchDisease = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "diseases", id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          setDiseaseData(snapshot.data());
        }
      } catch (err) {
        console.error("Failed to fetch disease:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisease();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex-1 h-full bg-zinc-900 flex items-center justify-center relative">
        <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!diseaseData) {
    return (
      <div className="flex-1 h-full bg-zinc-900 flex items-center justify-center relative">
        <div className="text-zinc-300 font-medium">Disease not found!</div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const hasHistory = diseaseData.history && diseaseData.history.length > 0;

  const chartData = {
    labels: hasHistory
      ? diseaseData.history.map((h) => formatDate(h.date))
      : [],
    datasets: [
      {
        label: "Threat Percentage",
        data: hasHistory
          ? diseaseData.history.map((h) => h.threatPercentage)
          : [],
        borderColor: "#22C55E",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#22C55E",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}% Threat`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,

        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          stepSize: 20,
          color: "#9ca3af", // zinc-400
          callback: (value) => `${value}%`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/diseases"
            className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-700 transition-colors shadow-sm shrink-0"
          >
            <ArrowLeft className="text-zinc-300" size={20} />
          </Link>
          <div className="flex-1 flex items-center justify-between min-w-0">
            <h1 className="text-3xl font-bold text-white truncate pr-4">
              {diseaseData.diseaseName}
            </h1>
            <button
              onClick={() => navigate(`/diseases/${id}/chat`)}
              className="bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6]/20 px-4 py-2 rounded-xl transition-colors font-medium flex items-center gap-2 shrink-0 border border-[#3b82f6]/20"
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Open Chat</span>
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity size={20} className="text-[#3b82f6]" />
            Threat Level History
          </h2>
          <div className="h-64 w-full">
            {hasHistory ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                No history data available to chart.
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
            Recommendations
          </h2>
          {diseaseData.recommendations &&
          diseaseData.recommendations.length > 0 ? (
            <ul className="space-y-3">
              {diseaseData.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-zinc-300 text-[15px] leading-relaxed"
                >
                  <span className="text-[#3b82f6] font-medium shrink-0">
                    {index + 1}.
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 italic">
              No recommendations available yet.
            </p>
          )}
        </div>

        {/* Analysis */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
            Analysis
          </h2>
          {diseaseData.analysis && diseaseData.analysis.length > 0 ? (
            <ul className="space-y-3">
              {diseaseData.analysis.map((point, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-zinc-300 text-[15px] leading-relaxed"
                >
                  <span className="text-[#3b82f6] font-medium shrink-0">
                    {index + 1}.
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500">
              No analysis yet. It will update based on your chat activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
