import React from 'react';
import { matchRoutes, RouteMatch, RouteObject, useRoutes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// #region layout
const LayoutPage = React.lazy(() => import('~/component/Layout/LayoutPage'));
const LoginView = React.lazy(() => import('~/component/Layout/LoginView'));
const NotFound = React.lazy(() => import('~/component/Layout/NotFound'));
// #endregion


// #region home page
const HomePage = React.lazy(() => import('~/page/home/HomePage'));

// #endregion

// #region admin page
// product
const CategoryListView = React.lazy(() => import('~/page/product/category/CategoryListView'));
const ProductListView = React.lazy(() => import('~/page/product/product/ProductListView'));


//system
const MenuListView = React.lazy(() => import('~/page/system/menu/MenuListView'));
const RoleListView = React.lazy(() => import('~/page/system/role/RoleListView'));
const UserListView = React.lazy(() => import('~/page/system/user/UserListView'));
// #endregion

const routeList = [
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/admin',
        element: <LayoutPage />,
        children: [
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
