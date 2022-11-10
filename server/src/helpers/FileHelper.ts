type FileHelperResponse = {
    isValid: boolean;
    message?: string;
};

const _15MB = 1024 * 1024 * 15;

export const ImageHelper = (file: Express.Multer.File | undefined): FileHelperResponse => {
    if (!file?.mimetype.match(/image.*/)) return { isValid: false, message: 'Chỉ hổ trợ định dạng hình ảnh' };
    if (file?.size > _15MB) return { isValid: false, message: `Size ảnh không được quá ${_15MB}B` };
    return { isValid: true };
};
