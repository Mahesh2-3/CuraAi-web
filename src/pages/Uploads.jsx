import { useState, useEffect, useRef } from "react";
import { auth, db } from "../lib/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { pickImage, pickMedicalFile } from "../utils/uploadCloudinary";
import ChatAttachment from "../components/ChatAttachment";
import {
  Send,
  UploadCloud,
  X,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

export default function Uploads() {
  const user = auth.currentUser;
  const [userMsg, setUserMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [pendingUpload, setPendingUpload] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return;

    console.log("📡 Setting up Firebase listener for uploads...");
    const uploadsRef = collection(db, "users", user.uid, "uploads");
    const q = query(uploadsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const uploads = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const allMessages = [];

          await Promise.all(
            uploads.map(async (upload) => {
              try {
                const msgsSnap = await getDocs(
                  collection(
                    db,
                    "users",
                    user.uid,
                    "uploads",
                    upload.id,
                    "messages",
                  ),
                );

                msgsSnap.forEach((m) => {
                  const d = m.data();
                  allMessages.push({
                    id: `${upload.id}-${m.id}`,
                    role:
                      d.role === "assistant"
                        ? "ai"
                        : d.role === "user"
                          ? "user"
                          : d.role,
                    message:
                      d.text ||
                      (d.analysisResult
                        ? JSON.stringify(d.analysisResult, null, 2)
                        : ""),
                    attachment:
                      d.attachment || upload.originalAttachment || null,
                    createdAt: d.createdAt?.seconds
                      ? new Date(d.createdAt.seconds * 1000).toISOString()
                      : upload.createdAt?.seconds
                        ? new Date(
                            upload.createdAt.seconds * 1000,
                          ).toISOString()
                        : new Date().toISOString(),
                  });
                });
              } catch (err) {
                console.error(
                  `❌ Error fetching messages for upload ${upload.id}:`,
                  err,
                );
              }
            }),
          );

          allMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          setMessages(allMessages);
        } catch (err) {
          console.error("❌ Error processing uploads snapshot:", err);
        }
      },
      (err) => {
        console.error("❌ Firebase listener error:", err);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleDeletePending = async () => {
    if (!pendingUpload) return;
    setPendingUpload(null);
    // Clean up Cloudinary later if needed
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!userMsg.trim() && !pendingUpload) || !user) return;

    const content = userMsg.trim();
    const attachment = pendingUpload;

    const newUserMsg = {
      id: Date.now().toString(),
      role: "user",
      message: content,
      attachment,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setUserMsg("");
    setPendingUpload(null);

    const loadingId = "loading-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "ai", message: "Analyzing...", attachment: null },
    ]);

    try {
      if (attachment) {
        const ipAddress =
          import.meta.env.VITE_PUBLIC_IP_ADDRESS || "localhost:3000";
        const saveRes = await fetch(`http://${ipAddress}/save-upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            message: content,
            publicId: attachment.publicId,
            secureUrl: attachment.secureUrl,
            resourceType: attachment.resourceType,
            format: attachment.format,
            bytes: attachment.bytes,
          }),
        });

        if (!saveRes.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === loadingId
                ? { ...m, message: "Failed to save upload. Please try again." }
                : m,
            ),
          );
          return;
        }

        // Firestore snapshot will trigger and remove loading state organically
        // but we clean up manually just in case
        setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? { ...m, message: "Error processing request. Please try again." }
            : m,
        ),
      );
    }
  };

  const handleImagePick = async () => {
    const result = await pickImage();
    if (result) setPendingUpload(result);
  };

  const handleFilePick = async () => {
    const result = await pickMedicalFile();
    if (result) setPendingUpload(result);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 px-4 md:px-8 py-6 relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
          <UploadCloud className="text-[#3b82f6]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Uploads Analysis</h1>
          <p className="text-sm text-zinc-400">
            Securely analyze scans and medical reports
          </p>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center text-center max-w-sm mx-auto h-full">
            <div className="w-20 h-20 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center mb-6 border-dashed shadow-sm">
              <UploadCloud size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No uploads yet
            </h3>
            <p className="text-zinc-500 text-sm">
              Upload medical images or PDFs to receive AI analysis and insights.
            </p>
          </div>
        ) : (
          messages.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col w-full ${
                item.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {item.attachment && (
                <ChatAttachment attachment={item.attachment} />
              )}

              <div
                className={`px-5 py-3.5 mt-1 text-[15px] leading-relaxed shadow-sm ${
                  item.role === "user"
                    ? "bg-[#3b82f6] text-white rounded-2xl rounded-tr-sm max-w-[85%] md:max-w-[75%]"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-2xl rounded-tl-sm max-w-[95%] md:max-w-[85%]"
                }`}
              >
                {item.role === "user" ? (
                  <p className="whitespace-pre-wrap">{item.message}</p>
                ) : (
                  <div className="prose prose-blue max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {item.message}
                    </Markdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 mt-4 bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden focus-within:border-[#3b82f6] focus-within:ring-1 focus-within:ring-[#3b82f6] transition-all shadow-sm">
        {/* Pending Upload Preview */}
        {pendingUpload && (
          <div className="flex items-center gap-3 bg-zinc-800 p-3 border-b border-zinc-700">
            {pendingUpload.resourceType === "image" ? (
              <img
                src={pendingUpload.secureUrl}
                alt="Pending"
                className="w-12 h-12 object-cover rounded-lg border border-zinc-700"
              />
            ) : (
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                <FileText className="text-[#3b82f6]" size={24} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {pendingUpload.format
                  ? pendingUpload.format.toUpperCase()
                  : "Attachment"}
              </p>
              <p className="text-xs text-zinc-500">
                {(pendingUpload.bytes / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={handleDeletePending}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-end gap-2 p-3">
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={handleImagePick}
              className="p-2.5 text-zinc-500 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-xl transition-colors"
              title="Upload Image"
            >
              <ImageIcon size={22} />
            </button>
            <button
              type="button"
              onClick={handleFilePick}
              className="p-2.5 text-zinc-500 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 rounded-xl transition-colors"
              title="Upload Document"
            >
              <FileText size={22} />
            </button>
          </div>

          <textarea
            value={userMsg}
            onChange={(e) => setUserMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Add a message to your analysis..."
            className="flex-1 bg-transparent text-white px-2 py-2.5 max-h-32 min-h-[44px] focus:outline-none resize-none placeholder:text-zinc-500 block"
            rows={1}
          />

          <button
            type="submit"
            disabled={!userMsg.trim() && !pendingUpload}
            className="flex-shrink-0 bg-[#3b82f6] hover:bg-blue-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white p-2.5 rounded-xl transition-colors disabled:cursor-not-allowed"
          >
            <Send
              size={18}
              className={
                userMsg.trim() || pendingUpload
                  ? "translate-x-0.5 -translate-y-0.5 transition-transform"
                  : ""
              }
            />
          </button>
        </form>
      </div>
    </div>
  );
}
