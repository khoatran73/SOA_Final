type FileHelperResponse = {
    isValid: boolean;
    message?: string;
};

const _5MB = 1024 * 1024 * 5;

export const ImageHelper = (file: Express.Multer.File | undefined): FileHelperResponse => {
    if (!file?.mimetype.match(/image.*/)) return { isValid: false, message: 'Chỉ hổ trợ định dạng hình ảnh' };
    if (file?.size > _5MB) return { isValid: false, message: `Size ảnh không được quá ${_5MB} MB` };
    return { isValid: true };
};
