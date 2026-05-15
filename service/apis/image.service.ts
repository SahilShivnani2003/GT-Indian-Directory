import { privateClient } from "../apiClient";

export const imageService = {
    uploadImage: (file: File) => privateClient.post('/UploadImage/upload', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    uploadMultipleImages: (files: File[]) => privateClient.post('/UploadImage/uploadMultiple', files, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    deleteImage: (imageUrl: string) => privateClient.delete('/UploadImage/delete', { params: { imageUrl: imageUrl } })
}