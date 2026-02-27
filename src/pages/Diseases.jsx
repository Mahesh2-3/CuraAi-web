import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Plus, ChevronRight, Activity } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

export default function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [diseaseDetails, setDiseaseDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    isAlert: true,
  });

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  /* =========================
     FETCH DISEASES FROM FIREBASE
  ========================= */

  const fetchDiseases = () => {
    if (!auth.currentUser) return;

    setLoading(true);

    const q = query(
      collection(db, "users", auth.currentUser.uid, "diseases"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            diseaseName: data.diseaseName,
            details: data.details,
            createdAt: data.createdAt,
            history: data.history,
          };
        });

        setDiseases(list);
        setLoading(false);
      },
      (error) => {
        console.error("FETCH DISEASES ERROR:", error);
        setModalState({
          isOpen: true,
          title: "Error",
          message: "Failed to load diseases",
          type: "danger",
          isAlert: true,
        });
        setLoading(false);
      },
    );

    return unsubscribe;
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const sanitizeText = (text) => {
    return text
      .replace(/[“”]/g, '"')
      .replace(/[’]/g, "'")
      .replace(/\n/g, " ")
      .trim();
  };

  /* =========================
     ADD DISEASE
  ========================= */
  const handleAddDisease = async () => {
    if (!diseaseName.trim() || !diseaseDetails.trim()) {
      setModalState({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill all fields",
        type: "warning",
        isAlert: true,
      });
      return;
    }

    try {
      setSubmitting(true);
      const ipAddress = import.meta.env.VITE_SERVER_URL;

      const res = await fetch(`${ipAddress}/add-disease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth?.currentUser?.uid,
          diseaseName: sanitizeText(diseaseName),
          details: sanitizeText(diseaseDetails),
        }),
      });
      const data = await res.json();

      setModalState({
        isOpen: true,
        title: "Success",
        message: data.message || "Disease added successfully",
        type: "success",
        isAlert: true,
      });

      setModalVisible(false);
      setDiseaseName("");
      setDiseaseDetails("");

      // fetchDiseases automatically updates via onSnapshot
    } catch (err) {
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to add disease",
        type: "danger",
        isAlert: true,
      });
      console.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="flex flex-col min-h-screen p-6 relative">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-blue-600 bg-clip-text text-transparent mb-1">
            Your Diseases
          </h1>
          <p className="text-zinc-300">
            Track and manage your health conditions.
          </p>
        </div>
        <button
          onClick={() => setModalVisible(true)}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white p-3 rounded-xl shadow-[0_4px_14px_0_rgba(76,175,80,0.39)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="font-medium hidden sm:inline">Add Disease</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && diseases.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 shadow-sm rounded-full flex items-center justify-center mb-6">
            <Activity size={32} className="text-[#3b82f6]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No diseases tracked yet
          </h3>
          <p className="text-zinc-500 mb-6">
            Keep a record of your medical conditions to get better insights and
            care recommendations.
          </p>
          <button
            onClick={() => setModalVisible(true)}
            className="bg-zinc-800 hover:bg-zinc-800 border border-zinc-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-sm"
          >
            Add your first condition
          </button>
        </div>
      )}

      {/* List */}
      {!loading && diseases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseases.map((item) => {
            const threat =
              item.history?.length > 0
                ? item.history[item.history.length - 1].threatPercentage
                : 0;
            const isHighThreat = threat > 60;
            const isWarning = threat > 30 && threat <= 60;

            return (
              <Link
                key={item.id}
                to={`/diseases/${item.id}`}
                className="bg-zinc-800 border border-zinc-700 hover:border-[#3b82f6]/50 rounded-2xl p-5 transition-all hover:shadow-[0_4px_20px_rgba(76,175,80,0.1)] group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-xl text-white group-hover:text-[#3b82f6] transition-colors line-clamp-1 pr-4">
                    {item.diseaseName}
                  </h3>
                  <div
                    className={`
                    px-2.5 py-1 rounded-full text-xs font-bold shrink-0
                    ${
                      isHighThreat
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : isWarning
                          ? "bg-orange-50 text-orange-600 border border-orange-200"
                          : "bg-[#3b82f6]/10 text-[#2E7D32] border border-[#3b82f6]/30"
                    }
                `}
                  >
                    {threat}% Threat
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between text-zinc-500 text-sm">
                  <span>View Details</span>
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* =========================
         ADD DISEASE MODAL
      ========================= */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div
            className="bg-zinc-800 border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Add Condition
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Condition Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Type 2 Diabetes"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  Details & Notes
                </label>
                <textarea
                  placeholder="Diagnosed in 2020, currently taking..."
                  value={diseaseDetails}
                  onChange={(e) => setDiseaseDetails(e.target.value)}
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setModalVisible(false)}
                className="px-5 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDisease}
                disabled={submitting}
                className="bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#3b82f6]/50 text-white px-6 py-2.5 rounded-xl transition-colors font-medium shadow-[0_4px_14px_0_rgba(76,175,80,0.39)]"
              >
                {submitting ? "Adding..." : "Add Condition"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isAlert={modalState.isAlert}
        confirmText="OK"
      />
    </div>
  );
}
