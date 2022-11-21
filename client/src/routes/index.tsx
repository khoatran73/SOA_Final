import React from 'react';
import { matchRoutes, RouteMatch, RouteObject, useRoutes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// #region layout
const LayoutPage = React.lazy(() => import('~/component/Layout/LayoutPage'));
const LoginView = React.lazy(() => import('~/component/Layout/LoginView'));
const NotFound = React.lazy(() => import('~/component/Layout/NotFound'));
// #endregion

// #region home page
const HomeMain = React.lazy(() => import('~/page/home/components/HomeMain'));
const HomePageLayout = React.lazy(() => import('~/page/home/HomePageLayout'));
const NewsView = React.lazy(() => import('~/page/home/components/news/NewsView'));
const NewsPush = React.lazy(() => import('~/page/home/components/news/NewsPush'));
const NewsDashBoard = React.lazy(() => import('~/page/home/components/news/NewsDashBoard'));
const NewsDetail = React.lazy(() => import('~/page/home/components/news/NewsDetail'));
const CategorySearch = React.lazy(() => import('~/page/home/components/category/CategorySearch'));
const NewsCheckout = React.lazy(() => import('~/page/home/components/news/NewsCheckout'));

const UserProfile = React.lazy(() => import('~/page/home/components/user/UserProfile'));
const UserInfo = React.lazy(() => import('~/page/home/components/user/UserInfo'));

const OrderView = React.lazy(() => import('~/page/home/components/order/OrderView'));
const OrderHistory = React.lazy(() => import('~/page/home/components/order/OrderHistory'));

// #endregion

// #region admin page
// admin home
const AdminHomeListView = React.lazy(() => import('~/page/admin/AdminHomeListView'));

// product
const CategoryListView = React.lazy(() => import('~/page/product/category/CategoryListView'));
const ProductTypeListView = React.lazy(() => import('~/page/product/product-type/ProductTypeListView'));
const ProductListView = React.lazy(() => import('~/page/product/product/ProductListView'));

//system
const MenuListView = React.lazy(() => import('~/page/system/menu/MenuListView'));
const RoleListView = React.lazy(() => import('~/page/system/role/RoleListView'));
const UserListView = React.lazy(() => import('~/page/system/user/UserListView'));
// #endregion
const RegisterView = React.lazy(() => import('~/component/Layout/RegisterView'));
const ChatView = React.lazy(() => import('~/page/home/components/chat/ChatView'));
const DepositCoins = React.lazy(() => import('~/page/home/components/dashboard/Depositcoins'));
const TransactionHistory = React.lazy(() => import('~/page/home/components/dashboard/TransactionHistory'));
const StatisticView = React.lazy(() => import('~/page/home/components/dashboard/statistic/StatisticView'));

const routeList = [
    {
        path: '/',
        element: <HomePageLayout />,
        children: [
            {
                path: '/',
                element: <HomeMain />,
            },
            {
                path: 'news',
                children: [
                    {
                        path: 'create',
                        element: <NewsView />,
                    },
                    {
                        path: 'edit/:id',
                        element: <NewsView />,
                    },
                    {
                        path: 'detail/:id',
                        element: <NewsDetail />,
                    },
                    {
                        path: 'day-tin/:id',
                        element: <NewsPush />,
                    },
                    { path: 'dashboard', element: <NewsDashBoard /> },
                    { path: 'checkout/:id', element: <NewsCheckout /> },
                ],
            },
            {
                path: 'category',
                element: <CategorySearch />,
            },
            {
                path: 'chat',
                element: <ChatView />,
            },
            {
                path: 'order',
                children: [
                    {
                        path: 'my-orders',
                        element: <OrderView />,
                    },
                    {
                        path: 'history/:id',
                        element: <OrderHistory />,
                    },
                ],
            },
            {
                path: 'dashboard',
                children: [
                    {
                        path: 'balances',
                        element: <DepositCoins />,
                    },
                    {
                        path: 'history',
                        element: <TransactionHistory />,
                    },
                    {
                        path: 'statistic',
                        element: <StatisticView />,
                    },
                ],
            },
            {
                path: 'user',
                children: [
                    {
                        path: 'info/:id',
                        element: <UserInfo />,
                    },
                    {
                        path: 'profile',
                        element: <UserProfile />,
                    },
                ],
            },
        ],
    },
    {
        path: '/admin',
        element: <LayoutPage />,
        children: [
            {
                path: 'home',
                element: (
                    <PrivateRoute>
                        <AdminHomeListView />
                    </PrivateRoute>
                ),
            },
            {
                path: 'system',
                children: [
                    {
                        path: 'menu',
                        element: (
                            <PrivateRoute>
                                <MenuListView />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: 'role',
                        element: (
                            <PrivateRoute>
                                <RoleListView />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: 'user',
                        element: (
                            <PrivateRoute>
                                <UserListView />
                            </PrivateRoute>
                        ),
                    },
                ],
            },
            {
                path: 'product',
                children: [
                    {
                        path: 'category',
                        element: (
                            <PrivateRoute>
                                <CategoryListView />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: 'type',
                        element: (
                            <PrivateRoute>
                                <ProductTypeListView />
                            </PrivateRoute>
                        ),
                    },
                    {
                        path: 'product',
                        element: (
                            <PrivateRoute>
                                <ProductListView />
                            </PrivateRoute>
                        ),
                    },
                ],
            },
        ],
    },
    {
        path: '/login',
        element: <LoginView />,
    },
    {
        path: '/register',
        element: <RegisterView />,
    },
    {
        path: '/*',
        element: <NotFound />,
    },
] as RouteObject[];

export const AppRoute: React.FC = () => {
    if (process.env.NODE_ENV !== 'production') {
        const elements = useRoutes(routeList);
        return <>{elements}</>;
    }
    const elements = useRoutes(routeList);
    return <>{elements}</>;
};

export const useMatchRoute = (pathName: string): RouteMatch<string>[] | null => {
    return matchRoutes(routeList, pathName);
};
