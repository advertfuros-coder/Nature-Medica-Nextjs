import { v2 as cloudinary } from 'cloudinary';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Original filename
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImageBuffer(buffer, filename, folder = 'products') {
  try {
    // Create temporary file
    const tempPath = join(tmpdir(), `upload-${Date.now()}-${filename}`);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: `naturemedica/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    // Delete temp file
    await unlink(tempPath);

    console.log('✅ Image uploaded:', result.public_id);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Upload multiple buffers
 */
export async function uploadMultipleBuffers(buffers, folder = 'products') {
  const results = [];
  for (const { buffer, filename } of buffers) {
    const result = await uploadImageBuffer(buffer, filename, folder);
    results.push(result);
  }
  return results;
}

/**
 * Delete image
 */
export async function deleteImage(publicId) {
  try {
    if (!publicId) return;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Deleted: ${publicId}`);
    return result;
  } catch (error) {
    console.error('❌ Delete error:', error);
  }
}

export default cloudinary;
