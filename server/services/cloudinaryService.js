import { v2 as cloudinary } from "cloudinary";

const DEFAULT_FOLDER = "bb_tracker";

export default class CloudinaryService {
  async uploadFiles(files, folder = DEFAULT_FOLDER) {
    if (!files?.length) return [];
    const images = await Promise.all(
      files.map((file) => cloudinary.uploader.upload(file.path, { folder }))
    );
    return images.map((image) => ({
      public_id: image.public_id,
      url: image.secure_url,
    }));
  }

  async destroyByPublicIds(publicIds) {
    if (!publicIds?.length) return;
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
  }

  async syncDamageReviewImages(existingImages, editedImages, newFiles) {
    const imagesToDelete = !editedImages
      ? existingImages ?? []
      : (existingImages ?? []).filter(
          (img) => !editedImages.some((e) => e.public_id === img.public_id)
        );

    await this.destroyByPublicIds(imagesToDelete.map((img) => img.public_id));

    const uploaded = await this.uploadFiles(newFiles);
    return [...(editedImages ?? []), ...uploaded];
  }
}
