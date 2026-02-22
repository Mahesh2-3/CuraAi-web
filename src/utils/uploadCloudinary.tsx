/* -----------------------------
   CONFIG
----------------------------- */

const CLOUD_NAME = "dhiluevpk";
const UPLOAD_PRESET = "CuraAi";

/* -----------------------------
   Helpers
----------------------------- */

// Helper to open standard web file picker
const selectFile = (accept: string): Promise<File | null> => {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;

        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            resolve(file || null);
        };

        input.oncancel = () => {
            resolve(null);
        };

        input.click();
    });
};

/* -----------------------------
   Image Upload (PUBLIC)
----------------------------- */

export const pickImage = async () => {
    console.log("📸 Opening image picker...");

    const file = await selectFile("image/*");
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    console.log("☁️ Uploading image to Cloudinary (public unsigned)...");

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
        console.error("❌ Image upload failed:", uploadData);
        throw new Error("Image upload failed");
    }

    console.log("✅ Image uploaded:", uploadData);

    return {
        publicId: uploadData.public_id,
        secureUrl: uploadData.secure_url,
        resourceType: uploadData.resource_type,
        format: uploadData.format,
        bytes: uploadData.bytes,
    };
}


export const pickMedicalFile = async () => {
    console.log("📄 Opening document picker (PDF)...");

    const file = await selectFile("application/pdf");
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    console.log("☁️ Uploading PDF to Cloudinary (public unsigned)...");

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
        console.error("❌ PDF upload failed:", uploadData);
        throw new Error("PDF upload failed");
    }

    console.log("✅ PDF uploaded:", uploadData);

    return {
        publicId: uploadData.public_id,
        secureUrl: uploadData.secure_url,
        resourceType: uploadData.resource_type,
        format:
            uploadData.format ||
            uploadData.public_id.split(".").pop() ||
            "pdf",
        bytes: uploadData.bytes,
    };
}
