// lib/cloudinaryUpload.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

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
