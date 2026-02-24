import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Activity } from "lucide-react";
import { useAuth } from "../../../context/authContext";
import { db } from "../../../lib/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import ConfirmModal from "../../../components/ConfirmModal";

export default function ManageDiseases() {
  const { user } = useAuth();
  const [diseases, setDiseases] = useState([]);
  const [isClearing, setIsClearing] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    isAlert: false,
    onConfirm: null,
  });

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "diseases"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDiseases(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          diseaseName: doc.data().diseaseName || "Unnamed Disease",
        })),
      );
    });
    return unsubscribe;
  }, [user]);

  const deleteDiseaseWithChats = async (diseaseId) => {
    if (!user) return;

    setModalState({
      isOpen: true,
      title: "Delete Disease",
      message: "This will delete the disease and all its chats. Are you sure?",
      type: "danger",
      isAlert: false,
      onConfirm: async () => {
        try {
          const batch = writeBatch(db);
          const chatSnap = await getDocs(
            collection(db, "users", user.uid, "diseases", diseaseId, "chat"),
          );
          chatSnap.forEach((doc) => batch.delete(doc.ref));
          batch.delete(doc(db, "users", user.uid, "diseases", diseaseId));
          await batch.commit();
        } catch (err) {
          console.error("Error deleting disease:", err);
          setModalState({
            isOpen: true,
            title: "Error",
            message: "Failed to delete disease.",
            type: "danger",
            isAlert: true,
            onConfirm: null,
          });
        }
      },
    });
  };

  const clearDiseaseChat = async (diseaseId) => {
    if (!user) return;

    setModalState({
      isOpen: true,
      title: "Clear Chat",
      message:
        "This will delete only the chat messages for this disease. Are you sure?",
      type: "warning",
      isAlert: false,
      onConfirm: async () => {
        try {
          const batch = writeBatch(db);
          const chatSnap = await getDocs(
            collection(db, "users", user.uid, "diseases", diseaseId, "chat"),
          );
          chatSnap.forEach((doc) => batch.delete(doc.ref));
          await batch.commit();
          setModalState({
            isOpen: true,
            title: "Success",
            message: "Chat cleared successfully.",
            type: "success",
            isAlert: true,
            onConfirm: null,
          });
        } catch (err) {
          console.error("Error clearing chat:", err);
          setModalState({
            isOpen: true,
            title: "Error",
            message: "Failed to clear chat.",
            type: "danger",
            isAlert: true,
            onConfirm: null,
          });
        }
      },
    });
  };

  const clearAllDiseases = async () => {
    if (!user || diseases.length === 0) return;

    setModalState({
      isOpen: true,
      title: "Clear All Diseases",
      message:
        "All diseases and their chats will be permanently deleted. Are you sure?",
      type: "danger",
      isAlert: false,
      onConfirm: async () => {
        setIsClearing(true);
        try {
          const batch = writeBatch(db);
          for (const disease of diseases) {
            const chatSnap = await getDocs(
              collection(db, "users", user.uid, "diseases", disease.id, "chat"),
            );
            chatSnap.forEach((doc) => batch.delete(doc.ref));
            batch.delete(doc(db, "users", user.uid, "diseases", disease.id));
          }
          await batch.commit();
        } catch (err) {
          console.error("Error clearing all diseases:", err);
          setModalState({
            isOpen: true,
            title: "Error",
            message: "Failed to clear all diseases.",
            type: "danger",
            isAlert: true,
            onConfirm: null,
          });
        } finally {
          setIsClearing(false);
        }
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 p-6 lg:p-10 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/profile/settings/data-control"
              className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm shrink-0"
            >
              <ArrowLeft className="text-zinc-400" size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Diseases History</h1>
          </div>

          {diseases.length > 0 && (
            <button
              onClick={clearAllDiseases}
              disabled={isClearing}
              className="text-red-500 hover:text-red-400 font-semibold text-sm transition-colors"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </button>
          )}
        </div>

        {diseases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-800 border border-zinc-700 rounded-2xl">
            <Activity size={48} className="text-zinc-600 mb-4" />
            <p className="text-zinc-400 font-medium">No disease found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diseases.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-800 border border-zinc-700 p-5 rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 flex items-center justify-center">
                      <Activity size={18} />
                    </div>
                    <span className="font-medium text-white truncate text-ellipsis text-lg">
                      {item.diseaseName}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteDiseaseWithChats(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-4 shrink-0"
                    aria-label="Delete disease"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-zinc-700">
                  <button
                    onClick={() => clearDiseaseChat(item.id)}
                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Chat only
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        isAlert={modalState.isAlert}
        confirmText={
          modalState.type === "danger"
            ? "Delete"
            : modalState.type === "warning"
              ? "Clear"
              : "OK"
        }
      />
    </div>
  );
}
