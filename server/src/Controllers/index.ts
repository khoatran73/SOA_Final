import { Application } from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import IdentityController from './Auth/IdentityController';
import CommonController from './Common/CommonController';
import PlacementController from './Common/PlacementController';
import CategoryController from './Product/CategoryController';
import MenuController from './System/MenuController';
import RoleController from './System/RoleController';

const route = (app: Application) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/menu', Authenticate, MenuController);
    app.use('/api/role', Authenticate, RoleController);
    app.use('/api/common', Authenticate, CommonController);
    app.use('/api/placement', Authenticate, PlacementController);
    app.use('/api/product/category', Authenticate, CategoryController);
};

export default route;
