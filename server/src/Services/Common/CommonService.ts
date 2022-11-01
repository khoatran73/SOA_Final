import { Request, Response } from 'express';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import { ImageHelper } from '../../helpers/FileHelper';
import User from '../../Models/User';
import { ComboOptionWithKey, Identifier } from '../../types/shared';
import { Cloudinary } from '../../utils/cloudinary';

const comboUserWithKey = async (req: Request, res: Response) => {
    const users = await User.find({ isAdmin: { $ne: true } });

    const result = users.map(
        user =>
            ({
                key: user.id,
                label: `${user.fullName} (${user.username})`,
            } as ComboOptionWithKey),
    );

    return res.json(ResponseOk<ComboOptionWithKey<Identifier>[]>(result));
};

const uploadFile = async (req: Request, res: Response) => {
    if (req.file) {
        const imageHelper = ImageHelper(req.file);
        if (imageHelper.isValid) {
            const result = await Cloudinary.upload(req.file.path);
            const { secure_url, public_id } = result;
            return res.json(ResponseOk<string>(secure_url));
        } else {
            return res.json(ResponseFail(imageHelper.message));
        }
    }
};


const CommonService = {
    comboUserWithKey,
    uploadFile,
};

export default CommonService;
