import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import Role from '../../Models/Role';
import User from '../../Models/User';
import UserRole from '../../Models/UserRole';
import { AppUser, AuthUser, LoginParams, NewUser } from '../../types/Auth/Identity';

declare module 'express-session' {
    interface SessionData {
        user: AppUser;
    }
}

const checkLogin = async (req: Request, res: Response) => {
    const user = req.session.user;
    // const user = {
    //     email: '',
    //     fullName: 'Quản trị viên hệ thống',
    //     id: 'a35002f3-c2bd-4949-a76f-9702e360feb7',
    //     isSupper: true,
    //     username: 'admin',
    //     phoneNumber: '',
    //     amount: 10127,
    //     district: '559',
    //     province: '54',
    //     ward: '22159',
    // };
    if (user) {
        const isSupper = user.isSupper;
        const userRoles = await UserRole.find({ userId: user.id });
        const roleIds = userRoles.map(x => x.roleId);
        const roles = isSupper ? await Role.find() : await Role.find({ id: { $in: roleIds } });
        const rolesCode = roles.map(x => x.code);

        const result: AuthUser = {
            rights: rolesCode,
            user,
        };
        return res.json(ResponseOk<AuthUser>(result));
    }
    return res.json(ResponseFail());
};

const addUser = async (req: Request<any, any, NewUser>, res: Response) => {
    try {
        const isExistUser = Boolean(await User.findOne({ username: req.body.username }));

        if (isExistUser) {
            return res.json(ResponseFail('UserName existed!'));
        }

        const user = new User({
            ...req.body,
        });

        user.setPassword(req.body.password);
        user.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

const login = async (req: Request<any, any, LoginParams>, res: Response) => {
    const user = await User.findOne({ username: req.body.username });

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
        },
    };
    req.session.user = result.user;

    return res.json(ResponseOk<AuthUser>(result));
};
const getUser = async (req: Request, res: Response) => {
    const id = req.query.id;
    const user = await User.findOne({ id: id });
    if (!Boolean(user)) return res.json(ResponseFail('User not found'));
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
        },
    };
    return res.json(ResponseOk(result));
}

const logout = (req: Request, res: Response) => {
    if (req.session.user) delete req.session.user;
    return res.json(ResponseOk());
};

const IdentityService = {
    checkLogin,
    login,
    addUser,
    logout,
    getUser
};

export default IdentityService;
