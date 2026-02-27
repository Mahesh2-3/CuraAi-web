const getUrl = async (publicId: string, resourceType: string) => {


    const ipAddress = import.meta.env.IP_ADDRESS;
    const endpoint = `${ipAddress}/sign-cloudinary`;

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            publicId,
            resourceType,
        }),
    });


    if (!res.ok) {
        const text = await res.text();
        console.error("❌ Signed URL request failed:", text);
        throw new Error("Failed to fetch signed URL");
    }

    const data = await res.json();

    return data.url;
}

export default getUrl;
