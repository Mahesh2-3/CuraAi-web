import { Paperclip, FileText } from "lucide-react";
import { openPrivateFile } from "../utils/openHelper";

export default function ChatAttachment({ attachment }) {
  const url = attachment.secureUrl;

  if (!url) {
    console.warn("⚠️ No URL available in attachment");
    return null;
  }

  /* -------------------------
       IMAGE ATTACHMENT
    ------------------------- */
  if (attachment.resourceType === "image") {
    return (
      <img
        src={url}
        alt="attachment"
        className="max-w-[220px] max-h-[220px] rounded-lg object-contain mt-2"
      />
    );
  }

  /* -------------------------
       FILE ATTACHMENT
    ------------------------- */
  return (
    <button
      onClick={() => {
        openPrivateFile(
          url,
          `attachment.${attachment.format?.toLowerCase() || "pdf"}`,
        );
      }}
      className="flex items-center gap-3 bg-zinc-800 px-4 py-3 mt-2 rounded-lg max-w-[80%] hover:bg-zinc-700 transition"
    >
      <FileText size={28} className="text-zinc-400" />

      <div className="flex-1 text-left">
        <p className="font-medium text-white truncate max-w-[120px]">
          {attachment.format ? attachment.format.toUpperCase() : "FILE"}
        </p>

        {attachment.bytes && (
          <p className="text-xs text-zinc-400">
            {(attachment.bytes / 1024).toFixed(1)} KB
          </p>
        )}
      </div>

      <span className="text-teal-400 font-semibold text-sm">Open</span>
    </button>
  );
}
