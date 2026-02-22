const getUrl = async (publicId: string, resourceType: string) => {
    console.log("🔗 [getUrl] Requesting signed URL");
    console.log("📦 publicId:", publicId);
    console.log("📁 resourceType:", resourceType);

    const ipAddress = import.meta.env.VITE_PUBLIC_IP_ADDRESS || "localhost:3000";
    const endpoint = `http://${ipAddress}/get-signed-url`;
    console.log("🌐 Endpoint:", endpoint);

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            publicId,
            resourceType,
        }),
    });

    console.log("📡 Response status:", res.status);

    if (!res.ok) {
        const text = await res.text();
        console.error("❌ Signed URL request failed:", text);
        throw new Error("Failed to fetch signed URL");
    }

    const data = await res.json();
    console.log("✅ Signed URL received:", data);

    return data.url;
}

export default getUrl;
