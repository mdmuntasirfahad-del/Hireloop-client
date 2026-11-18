const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/png", "image/jpeg", "image/jpg"]);

// Browser-only helper shared by the company logo and profile photo editors.
// The ImgBB key is public by design; never pass secrets through this module.
export async function uploadImageToImgbb(file) {
    if (!file) {
        throw new Error("Choose an image to upload.");
    }

    if (!allowedTypes.has(String(file.type || "").toLowerCase())) {
        throw new Error("Upload a PNG or JPG image.");
    }

    if (file.size > MAX_FILE_BYTES) {
        throw new Error("File size exceeds the 5MB limit.");
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
        throw new Error("Image upload is not configured.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${IMGBB_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload the image. Try again.");
    }

    const data = await response.json();
    const url = data?.data?.url;

    if (!data?.success || !url) {
        throw new Error("Failed to upload the image. Try again.");
    }

    return url;
}
