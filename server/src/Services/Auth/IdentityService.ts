import { Request, Response } from 'express';
import _ from 'lodash';
import SendMail from '../../common/SendMail';
import { SendMailProps } from '../../common/SendMail';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import Role from '../../Models/Role';
import User from '../../Models/User';
import UserRole from '../../Models/UserRole';
import { AppUser, AuthUser, LoginParams, NewUser } from '../../types/Auth/Identity';
import PlacementService from '../Common/PlacementService';
import Otp from '../../Models/Otp';

declare module 'express-session' {
    interface SessionData {
        user: AppUser;
    }
}

const checkLogin = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    const user = await User.findOne({ id: userId });
    if (!userId || !user) return res.json(ResponseFail());

    const isSupper = user.hasRoleAdminSystem();
    const userRoles = await UserRole.find({ userId: user.id });
    const roleIds = userRoles.map(x => x.roleId);
    const roles = isSupper ? await Role.find() : await Role.find({ id: { $in: roleIds } });
    const rolesCode = roles.map(x => x.code);

    const result: AuthUser = {
        rights: rolesCode,
        user: {
            email: user.emailAddress,
            fullName: user.fullName,
            id: user.id,
            isSupper: isSupper,
            username: user.username,
            phoneNumber: user.phoneNumber,
            amount: user.amount,
            province: user.province,
            district: user.district,
            ward: user.ward,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    };
    return res.json(ResponseOk<AuthUser>(result));
};

const addUser = async (req: Request<any, any, NewUser>, res: Response) => {
    try {
        const isExistUser = Boolean(await User.findOne({ username: req.body.username }));
        const password = req.body.password;
        if (isExistUser) {
            return res.json(ResponseFail('UserName existed!'));
        }

        const user = new User({
            ...req.body,
        });

        user.setPassword(password);
        user.save();
        let codeOTP = Number(Math.floor(Math.random() * 1000000 + 1));
        let checkOTP = await Otp.findOne({ otpCode: codeOTP, transactionId: user.username });
        while (Boolean(checkOTP)) {
            checkOTP = await Otp.findOne({ otpCode: codeOTP, transactionId: user.username });
            if (Boolean(checkOTP)) {
                codeOTP = Number(Math.floor(Math.random() * 1000000 + 1));
            }
        }
        await Otp.create({
            otpCode: codeOTP,
            transactionId: user.username
        }); 
        const paramSendMail: SendMailProps = {
            emailTo: user.emailAddress,
            subject: 'Mã dùng một lần của bạn!',
            html: `
                <div><p>Xin chào <a href="#">${user.emailAddress}</a></p></div>
                <div><p>Chúng tôi đã nhận yêu cầu mã dùng một lần</p></div> <br/><br/>
                <div><p>Mã dùng 1 lần của bạn là: <strong style="font-size:20px;color:red">${codeOTP}</strong></p></div> <br/><br/>
                <div><p>Nếu không yêu cầu mã này thì bạn có thể vui lòng bỏ qua một cách an toàn.</p></div></br><br/>
                <div><p>Có thể ai đó đã nhập địa chỉ email của bạn do nhầm lẫn.</p></div></br><br/>
                <p>Xin cảm ơn,</p>
            `,
        };
        await SendMail(paramSendMail);
        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

const accuracyAccount = async(req: Request,res: Response) => {
    const { otpCode, username } = req.body
    const checkOtp = await Otp.findOneAndDelete({otpCode: otpCode, transactionId: username , expiredAt : { $gt: new Date() }})
    if(!checkOtp) return res.json(ResponseFail('Mã OTP không đúng!'))
    await User.findOneAndUpdate({username: username} , {isAccuracy: true})
    return res.json(ResponseOk())
}

const login = async (req: Request<any, any, LoginParams>, res: Response) => {
    const user = await User.findOne({ username: req.body.username , isAccuracy: true });

    if (!user) {
        return res.json(ResponseFail('Tài khoản hoặc mật khẩu không đúng!'));
    }

    if (!user.validPassword(req.body.password)) {
        return res.json(ResponseFail('Tài khoản hoặc mật khẩu không đúng!'));
    }

    const isSupper = user.hasRoleAdminSystem();
    const userRoles = await UserRole.find({ userId: user.id });
    const roleIds = userRoles.map(x => x.roleId);
    const roles = isSupper ? await Role.find() : await Role.find({ id: { $in: roleIds } });
    const rolesCode = roles.map(x => x.code);

    const result: AuthUser = {
        rights: rolesCode,
        user: {
            email: user.emailAddress,
            fullName: user.fullName,
            id: user.id,
            isSupper: isSupper,
            username: user.username,
            phoneNumber: user.phoneNumber,
            amount: user.amount,
            province: user.province,
            district: user.district,
            ward: user.ward,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    };
    req.session.user = result.user;

    return res.json(ResponseOk<AuthUser>(result));
};
const getUser = async (req: Request, res: Response) => {
    const id = req.query.id;
    const user = await User.findOne({ id: id , isAccuracy: true });
    if (!Boolean(user)) return res.json(ResponseFail('User not found'));
    const provinceName = PlacementService.getProvinceByCode(user?.province)?.name;
    const districtName = PlacementService.getDistrictByCode(user?.province, user?.district)?.name;
    const wardName = PlacementService.getWardByCode(user?.district, user?.ward)?.name;

    const result = {
        user: {
            email: user?.emailAddress,
            fullName: user?.fullName,
            id: user?.id,
            username: user?.username,
            phoneNumber: user?.phoneNumber,
            amount: user?.amount,
            province: user?.province,
            district: user?.district,
            ward: user?.ward,
            provinceName,
            districtName,
            wardName,
            address: user?.address,
            avatar: user?.avatar,
        },
    };
    return res.json(ResponseOk(result));
};

const logout = (req: Request, res: Response) => {
    if (req.session.user) delete req.session.user;
    return res.json(ResponseOk());
};

const updateUser = async (req: Request<{ id: string }, any, AppUser, any>, res: Response) => {
    const id = req.params.id;
    if (req.session.user?.id !== id) {
        return res.json(ResponseFail('Bạn không phải người này!'));
    }
    const user = await User.findOne({ id: id });
    if (!user) {
        return res.json(ResponseFail('Không tìm thấy người dùng!'));
    }

    await User.updateOne(
        { id: id },
        {
            ...req.body,
        },
    );

    return res.json(ResponseOk());
};

const IdentityService = {
    checkLogin,
    login,
    addUser,
    logout,
    getUser,
    updateUser,
    accuracyAccount
};

export default IdentityService;
