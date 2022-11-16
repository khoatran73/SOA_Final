import { Request, Response } from 'express';
import _ from 'lodash';
import { ResponseFail, ResponseOk } from '../../common/ApiResponse';
import { PaginatedList, PaginatedListConstructor, PaginatedListQuery } from '../../common/PaginatedList';
import Menu from '../../Models/Menu';
import Role from '../../Models/Role';
import UserRole from '../../Models/UserRole';
import { IMenu, MenuLayout } from '../../types/System/Menu';

const getMenuIndex = async (req: Request<any, any, any, PaginatedListQuery>, res: Response) => {
    const menus = await Menu.find().exec();

    const menuResults = menus
        .sort((a, b) => a.level - b.level)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map(menu => {
            const doc = _.get({ ...menu }, '_doc') ?? {};
            return { ...doc, group: buildTreeGroup(menu.path, menus) } as IMenu;
        });

    const result = PaginatedListConstructor<IMenu>(menuResults, req.query.offset, req.query.limit);

    return res.json(ResponseOk<PaginatedList<IMenu>>(result));
};

const getMenuLayout = async (req: Request, res: Response) => {
    const menus = await Menu.find();
    // const user = req.session.user;
    const user = {
        email: '',
        fullName: 'Quản trị viên hệ thống',
        id: 'a35002f3-c2bd-4949-a76f-9702e360feb7',
        isSupper: true,
        username: 'admin',
        phoneNumber: '',
        amount: 10127,
    };

    const isSupper = user?.isSupper;
    const userRoles = await UserRole.find({ userId: user?.id });
    const roleIds = userRoles.map(x => x.roleId);
    const roles = isSupper ? await Role.find() : await Role.find({ id: { $in: roleIds } });
    const rolesCode = roles.map(x => x.code);

    const result = menus
        .filter(menu => !menu.permissions || rolesCode.includes(menu.permissions ?? ''))
        .sort((a, b) => a.level - b.level)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        .map(menu => {
            return {
                key: menu.id,
                name: menu.name,
                route: menu.route,
                icon: menu.icon,
                parentKey: menu.parentId,
                background: menu.background,
                isDisplay: menu.isDisplay,
                level: menu.level,
                path: menu.path,
                breadcrumbs: buildTreeGroup(menu.path, menus),
                hasPermissionToAccess: menu.permissions,
                permissions: menu.permissions,
            } as MenuLayout;
        });

    return res.json(ResponseOk<MenuLayout[]>(result));
};

const addMenu = async (req: Request<any, any, IMenu>, res: Response) => {
    try {
        const isExistMenu = Boolean(await Menu.findOne({ route: req.body.route }));

        if (isExistMenu) {
            return res.json(ResponseFail('Route đã tồn tại!'));
        }

        const parentMenu = await Menu.findOne({ id: req.body.parentId });

        const menu = new Menu({
            ...req.body,
        });

        menu.setPath(parentMenu?.path);

        menu.save();

        return res.json(ResponseOk());
    } catch (err) {
        return res.json(ResponseFail(_.get(err, 'message')));
    }
};

const updateMenu = async (req: Request<{ id: string }, any, IMenu>, res: Response) => {
    const id = req.params.id;

    const menu = await Menu.findOne({ id: id });

    if (!menu) {
        return res.json(ResponseFail('Không tìm thấy Menu!'));
    }

    await Menu.updateOne(
        { id: id },
        {
            ...req.body,
        },
    );

    return res.json(ResponseOk());
};

const deleteMenu = async (req: Request<{ id: string }, any, IMenu>, res: Response) => {
    const id = req.params.id;
    return Menu.deleteOne({ id: id })
        .then(() => res.json(ResponseOk()))
        .catch(err => res.json(ResponseFail(err?.message)));
};

// #region private func

const buildTreeGroup = (path: string, menus: IMenu[]): string[] => {
    const arrPath = path?.split('.') as string[];
    const groupResponse = [] as string[];

    arrPath.forEach(id => groupResponse.push(menus.find(x => x.id === id)?.name ?? ''));

    return groupResponse;
};

// #endregion

const MenuService = {
    getMenuIndex,
    getMenuLayout,
    addMenu,
    updateMenu,
    deleteMenu,
};

export default MenuService;
