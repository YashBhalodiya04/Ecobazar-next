// lib/cloudinaryUpload.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  folder: string = "nextjs_uploads"
): Promise<string> {
  if (!file) throw new Error("No file provided");

  // Convert to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload via stream
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  return result.secure_url; // return the uploaded file URL
}

/**
 * Delete file from Cloudinary by its public ID
 * @param publicId Cloudinary public_id (e.g. "nextjs_uploads/abcd1234")
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) throw new Error("Public ID is required for deletion");

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok" || result.result === "not found"; // return true if deleted or already not found
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return false;
  }
}
