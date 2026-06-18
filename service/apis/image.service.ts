import { privateClient } from "../apiClient";

export const imageService = {
    uploadImage: (file: File) => privateClient.post('/UploadImage/upload', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    uploadMultipleImages: (formdata: FormData) => privateClient.post('/UploadImage/upload-multiple', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
    deleteImage: (imageUrl: string) => privateClient.delete('/UploadImage/delete', { params: { imageUrl: imageUrl } })
}