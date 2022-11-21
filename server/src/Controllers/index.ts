import { Express, Request, Response } from 'express';
import Authenticate from '../MiddleWares/Authenticate';
import IdentityController from './Auth/IdentityController';
import CommonController from './Common/CommonController';
import PlacementController from './Common/PlacementController';
import PaymentController from './Common/PaymentController';
import TransactionHistoryController from './Common/TransactionHistoryController';
import ChatController from './Home/ChatController';
import NewsController from './Home/NewsController';
import OrderController from './Home/OrderController';
import StatisticController from './Home/StatisticController';
import CategoryController from './Product/CategoryController';
import ProductTypeController from './Product/ProductTypeController';
import MenuController from './System/MenuController';
import RoleController from './System/RoleController';

const routes = (app: Express) => {
    app.use('/api/identity', IdentityController);
    app.use('/api/menu', Authenticate, MenuController);
    app.use('/api/role', Authenticate, RoleController);
    app.use('/api/common', Authenticate, CommonController);
    app.use('/api/payment', Authenticate, PaymentController);
    app.use('/api/history', Authenticate, TransactionHistoryController);
    app.use('/api/placement', Authenticate, PlacementController);
    app.use('/api/product/category', Authenticate, CategoryController);
    app.use('/api/product/type', Authenticate, ProductTypeController);
    // home
    app.use('/api/home/news', Authenticate, NewsController);
    app.use('/api/chat', Authenticate, ChatController);
    app.use('/api/home/order', Authenticate, OrderController);
    app.use('/api/home/statistic', Authenticate, StatisticController);
};

export default routes;
