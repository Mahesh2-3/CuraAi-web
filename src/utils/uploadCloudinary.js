export const uploadFileToCloudinary = async (file) => {
  const CLOUD_NAME = "dhiluevpk";
  const UPLOAD_PRESET = "CuraAi";

  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    throw error;
  }
};
