import { Application } from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import IdentityController from './Auth/IdentityController';
import CommonController from './Common/CommonController';
import PlacementController from './Common/PlacementController';
import PaymentController from './Common/PaymentController';
import ChatController from './Home/ChatController';
import NewsController from './Home/NewsController';
import CategoryController from './Product/CategoryController';
import ProductTypeController from './Product/ProductTypeController';
import MenuController from './System/MenuController';
import RoleController from './System/RoleController';

const route = (app: Application) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/menu', Authenticate, MenuController);
    app.use('/api/role', Authenticate, RoleController);
    app.use('/api/common', Authenticate, CommonController);
    app.use('/api/payment', Authenticate, PaymentController);
    app.use('/api/placement', Authenticate, PlacementController);
    app.use('/api/product/category', Authenticate, CategoryController);
    app.use('/api/product/type', Authenticate, ProductTypeController);
    // home
    app.use('/api/home/news', Authenticate, NewsController);
    app.use('/api/chat', Authenticate, ChatController);
    
};

export default route;
