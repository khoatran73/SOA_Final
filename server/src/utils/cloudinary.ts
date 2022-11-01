import cloudinary, { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export const CloudinaryFolder = 'SOA-Final';

export const Cloudinary = {
    upload: async (file: string, folder: string = CloudinaryFolder): Promise<Promise<UploadApiResponse>> => {
        return await new Promise(resolve => {
            cloudinary.v2.uploader.upload(
                file,
                {
                    folder: folder,
                },
                (err?: UploadApiErrorResponse, callResult?: UploadApiResponse) => {
                    resolve({ ...callResult } as UploadApiResponse);
                }, 
            );
        });
    },
    destroy: async (publicId: string) => {
        return await new Promise(resolve => {
            cloudinary.v2.uploader.destroy(publicId, result => {
                resolve({
                    message: 'destroy success',
                });
            });
        });
    },
};
