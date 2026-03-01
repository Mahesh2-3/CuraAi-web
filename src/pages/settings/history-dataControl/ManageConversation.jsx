import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, MessageSquare } from "lucide-react";
import { useAuth } from "../../../context/authContext";
import { db } from "../../../lib/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import ConfirmModal from "../../../components/ConfirmModal";

export default function ManageConversation() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
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
      collection(db, "users", user.uid, "conversations"),
      orderBy("updatedAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setConversations(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "New Chat",
        })),
      );
    });
    return unsubscribe;
  }, [user]);

  const deleteConversationAndMessages = async (id) => {
    if (!user) return;

    setModalState({
      isOpen: true,
      title: "Delete Conversation",
      message: "Are you sure you want to delete this conversation?",
      type: "danger",
      isAlert: false,
      onConfirm: async () => {
        closeModal();
        try {
          const batch = writeBatch(db);

          // Delete messages
          const msgsSnap = await getDocs(
            collection(db, "users", user.uid, "conversations", id, "messages"),
          );
          msgsSnap.forEach((msgDoc) => batch.delete(msgDoc.ref));

          // Delete conversation doc
          batch.delete(doc(db, "users", user.uid, "conversations", id));

          await batch.commit();
        } catch (err) {
          setModalState({
            isOpen: true,
            title: "Error",
            message: "Failed to delete conversation.",
            type: "danger",
            isAlert: true,
            onConfirm: null,
          });
        }
      },
    });
  };

  const clearAllConversations = async () => {
    if (!user || conversations.length === 0) return;

    setModalState({
      isOpen: true,
      title: "Clear All Conversations",
      message: "Are you sure you want to permanently delete ALL conversations?",
      type: "danger",
      isAlert: false,
      onConfirm: async () => {
        closeModal();
        setIsClearing(true);
        try {
          const batch = writeBatch(db);

          for (const chat of conversations) {
            const msgsSnap = await getDocs(
              collection(
                db,
                "users",
                user.uid,
                "conversations",
                chat.id,
                "messages",
              ),
            );
            msgsSnap.forEach((msgDoc) => batch.delete(msgDoc.ref));
            batch.delete(doc(db, "users", user.uid, "conversations", chat.id));
          }

          await batch.commit();
        } catch (err) {
          setModalState({
            isOpen: true,
            title: "Error",
            message: "Failed to clear conversations.",
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
              <ArrowLeft className="text-zinc-300" size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-white">Conversations</h1>
          </div>

          {conversations.length > 0 && (
            <button
              onClick={clearAllConversations}
              disabled={isClearing}
              className="text-red-500 hover:text-red-400 font-semibold text-sm transition-colors"
            >
              {isClearing ? "Clearing..." : "Clear All"}
            </button>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-800 border border-zinc-700 rounded-2xl">
            <MessageSquare size={48} className="text-zinc-600 mb-4" />
            <p className="text-zinc-300 font-medium">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between bg-zinc-800 border border-zinc-700 p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg shrink-0 flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                  <span className="font-medium text-white truncate text-ellipsis">
                    {chat.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteConversationAndMessages(chat.id)}
                  className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors ml-4 shrink-0"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={20} />
                </button>
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
        confirmText={modalState.type === "danger" ? "Delete" : "OK"}
      />
    </div>
  );
}
