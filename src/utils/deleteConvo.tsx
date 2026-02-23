export const deleteConversation = async (id: string | undefined, userId: string | undefined) => {
    const confirmDelete = window.confirm("Delete conversation? This conversation will be permanently deleted.");
    if (!confirmDelete) return;

    try {
        const ipAddress = import.meta.env.VITE_PUBLIC_IP_ADDRESS || "localhost:3000";
        await fetch(`${ipAddress}/delete-conversation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userId,
                conversationId: id,
            }),
        });
    } catch (error) {
        console.error("Failed to delete conversation:", error);
    }
}

export const clearAllConversations = async (userId: string | undefined) => {
    if (!userId) return;

    const confirmClear = window.confirm("Clear all conversations? This action cannot be undone.");
    if (!confirmClear) return;

    try {
        const ipAddress = import.meta.env.VITE_PUBLIC_IP_ADDRESS || "localhost:3000";
        await fetch(`${ipAddress}/delete-all-conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userId,
            }),
        });
    } catch (error) {
        console.error("Failed to clear conversations:", error);
    }
}
