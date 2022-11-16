import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
import { faLock, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Button, Dropdown, Image, Menu } from 'antd';
import Search from 'antd/lib/input/Search';
import clsx from 'clsx';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '~/AppStore';
import logoBlack from '~/assets/logo/logo-black.png';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { useMergeState } from '~/hook/useMergeState';
import { PaginatedList, requestApi } from '~/lib/axios';
import { logoutAsync } from '~/store/authSlice';
import { NewsSearch } from '~/types/home/news';
import HomeContainer from '../layout/HomeContainer';
import { NEWS_SEARCH_API } from './../api/api';

interface State {
    openSearchResult: boolean;
    newsResult: NewsSearch[];
    searchKey: string | undefined;
}

type Action = 'adminPage' | 'logout';

const HomeHeader: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useMergeState<State>({
        openSearchResult: false,
        newsResult: [],
        searchKey: searchParams.get('searchKey') || undefined,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, authUser } = useAppState(state => state.authData);

    const onSearch = async (value: string) => {
        console.log('onsearch');
        // const response = await requestApi<PaginatedList<NewsSearch>>(
        //     'get',
        //     NEWS_SEARCH_API,
        //     {},
        //     { params: { searchKey: value } },
        // );
        // if (response?.data?.success) {
        //     setState({
        //         newsResult: response?.data?.result?.items || [],
        //     });
        // }
    };

    useEffect(() => {
        const searchKey = searchParams.get('searchKey') || state.searchKey;
        setState({ searchKey: searchKey });
        fetchSearch(searchKey);
    }, [searchParams]);

    const onChange = _.debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState({ searchKey: value });

        if (value.trim().length > 0) {
            await fetchSearch(value);
            !state.openSearchResult && setState({ openSearchResult: true });
        } else {
            state.openSearchResult && setState({ openSearchResult: false });
        }
    }, 200);

    const fetchSearch = async (searchKey: string | undefined) => {
        const response = await requestApi<PaginatedList<NewsSearch>>(
            'get',
            NEWS_SEARCH_API,
            {},
            { params: { searchKey: searchKey } },
        );

        if (response?.data?.success) {
            setState({
                newsResult: response?.data?.result?.items || [],
            });
        }
    };

    const onBlur = (event: any) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            //focus out
            state.openSearchResult && setState({ openSearchResult: false });
        }
    };

    const onFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value.trim().length > 0) {
            !state.openSearchResult && setState({ openSearchResult: true });
        } else {
            state.openSearchResult && setState({ openSearchResult: false });
        }
    };

    const onActionClick = (action: Action) => {
        switch (action) {
            case 'adminPage':
                navigate('/admin/home');
                return;
            case 'logout':
                dispatch(logoutAsync(() => null));
                return;
        }
    };

    const menu = (
        <Menu>
            {authUser?.user.isSupper && (
                <Menu.Item key="adminPage" onClick={() => onActionClick('adminPage')}>
                    <div className="flex items-center justify-start">
                        <BaseIcon icon={faLock} />
                        <span className="ml-3">Trang quản trị</span>
                    </div>
                </Menu.Item>
            )}
            <Menu.Item key="logout" onClick={() => onActionClick('logout')}>
                <div className="flex items-center justify-start">
                    <BaseIcon icon={faSignOut} />
                    <span className="ml-3">Đăng xuất</span>
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <div
            className={clsx(
                'home-header w-full ',
                //
            )}
        >
            <HomeContainer className="flex flex-col justify-between py-0">
                <div className="h-[52%] flex items-center justify-between">
                    <div>
                        <Image
                            src={logoBlack}
                            height={35}
                            preview={false}
                            onClick={() => navigate('/')}
                            className="cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className={clsx(
                                'h-9 cursor-pointer flex items-center mx-1.5 justify-center rounded ',
                                'text-black px-2 hover:bg-gray-200 hover:bg-opacity-50 duration-75 mx-2 text-base',
                                'hover:text-black',
                            )}
                        >
                            <svg
                                data-type="monochrome"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 23 25"
                                width="1em"
                                height="1em"
                                fill="none"
                                className="mr-1.5"
                            >
                                <path
                                    fill="currentColor"
                                    d="M21.188 23.142h-5.42v-5.115c0-1.23-.45-2.386-1.27-3.255a4.34 4.34 0 00-3.186-1.384 4.34 4.34 0 00-3.186 1.384 4.719 4.719 0 00-1.27 3.255v5.115h-5.42V9.559L11.313 1.7l9.876 7.858v13.583zm1.235-14.437L11.608.101A.55.55 0 0011.313 0a.575.575 0 00-.297.1L.202 8.706A.548.548 0 000 9.134v14.918c0 .275.236.526.496.526h7.3c.26 0 .497-.25.497-.526v-6.025c0-.863.312-1.669.878-2.27a2.92 2.92 0 012.141-.933 2.92 2.92 0 012.141.933c.567.601.879 1.407.879 2.27v6.025c0 .275.236.526.496.526h7.3c.26 0 .496-.25.496-.526V9.134a.552.552 0 00-.201-.429z"
                                />
                            </svg>
                            Trang Chủ
                        </Link>
                        <Link
                            to="/news/dashboard"
                            className={clsx(
                                'h-9 cursor-pointer flex items-center mx-1.5 justify-center rounded ',
                                'text-black px-2 hover:bg-gray-200 hover:bg-opacity-50 duration-75 mx-2 text-base',
                                'hover:text-black',
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                data-type="monochrome"
                                viewBox="0 0 26.272 24.4"
                                width="1em"
                                height="1em"
                                fill="none"
                                className="mr-1.5"
                            >
                                <g fill="currentColor">
                                    <path d="M7.93 10.791c1.502.355 3.04.533 4.582.528 2.287 0 4.535-.382 6.17-1.05.974-.465.557-.225 1.246-.702l.528-.464c.369.736.992 1.27 1.508 1.712l.22.191a7.999 7.999 0 01.976 3.8c0 4.424-3.738 8.162-8.162 8.162-4.424 0-8.162-3.738-8.162-8.162a7.99 7.99 0 011.095-4.015zm-5.464-4.9l.232-.141a8.086 8.086 0 01-.217-.403l-.017-.032a10.24 10.24 0 01-.448-1.03 6.989 6.989 0 002.028.831 1.23 1.23 0 001.382-.646l.254-.145c1.734-.037 3.48-.766 5.172-1.471 1.276-.532 2.48-1.034 3.55-1.192.67-.1 1.308-.15 1.892-.15 1.63 0 2.86.386 3.552 1.114.464.489.68 1.129.64 1.9-.025.51.267.981.734 1.186.438.19.972.097 1.32-.226.126.099.27.172.427.216.413.115.652.216.8.338.16.13.314.364.503.76.876 1.832.478 2.79-.181 4.376l-.018.045c-.126-.435-.291-.77-.587-1.054a11.595 11.595 0 00-.546-.488c-.516-.442-1.05-.898-1.231-1.458A1.222 1.222 0 0019.6 7.82l-.385.399c-.825.547-.582.377-.98.615-.04.018-.08.035-.12.05-1.46.597-3.503.94-5.603.94-1.59 0-3.253-.195-4.567-.534a1.236 1.236 0 00-.937.137c-.232.14-.34.38-.633 1.022l-.143.313c-.19-.714-.428-1.595-.605-2.055a1.228 1.228 0 00-.52-.614c-.8-.473-1.456-1.03-1.952-1.659a4.43 4.43 0 01-.077-.1l-.076-.106a6.617 6.617 0 01-.299-.472l-.191.11.187-.114-.233.14zm23.154.264c-.213-.448-.417-.783-.66-1.045l.62.31-.62-.883c-.345-.49-.967-.77-1.708-.77-.463 0-.914.107-1.274.295-.06-.958-.417-1.802-1.048-2.466C19.634.232 17.25-.271 14.183.182c-1.254.185-2.602.747-3.906 1.291-1.6.667-3.255 1.357-4.734 1.357-1.92-.205-2.354-.722-3.372-1.783l.086.795.009.065c.039.248.15.516.327.793.069.11.147.218.232.325-.886-.538-1.602-1.343-2.17-2.43L.345 0 .153.644C-.32 2.23.387 4.523 1.13 5.993l.02.046.005.005c.08.156.164.311.252.464l.084.14.014.023c.085.142.175.28.27.416l.016.022c.06.086.124.17.189.253.593.75 1.36 1.413 2.283 1.97.895 2.367 1.099 4.39 1.145 5.17-.004.1-.005.202-.005.304 0 5.2 4.394 9.594 9.594 9.594 5.2 0 9.595-4.394 9.595-9.594 0-.133-.003-.265-.01-.396.21-1.031.555-1.859.888-2.66.704-1.696 1.312-3.16.15-5.595z" />
                                    <path d="M11.84 14.937a1.052 1.052 0 000-2.1 1.052 1.052 0 000 2.1m6.547 0a1.052 1.052 0 000-2.1 1.052 1.052 0 000 2.1m-3.328 5.912c1.97 0 3.767-.987 4.69-2.576a.718.718 0 00-1.24-.72c-.667 1.149-1.99 1.863-3.45 1.863-1.462 0-2.784-.714-3.451-1.863a.711.711 0 00-.436-.332.717.717 0 00-.803 1.052c.922 1.589 2.72 2.576 4.69 2.576" />
                                </g>
                            </svg>
                            Quản Lý Tin
                        </Link>
                        <div className="flex-1 flex items-center justify-end">
                            <Dropdown overlay={menu}>
                                <div
                                    className={clsx(
                                        'h-9 cursor-pointer flex items-center mx-1.5 justify-center rounded ',
                                        'text-black px-2 hover:bg-gray-200 hover:bg-opacity-50 duration-75',
                                    )}
                                >
                                    <Avatar
                                        size={32}
                                        icon={<UserOutlined style={{ color: '#000' }} />}
                                        className="flex items-center justify-center bg-transparent rounded-full"
                                    />
                                    <span className="mx-2">{authUser?.user.fullName}</span>
                                    <CaretDownFilled />
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="h-[48%] flex justify-between">
                    <div className="relative w-[700px] home-header-search" onBlur={onBlur}>
                        <Search
                            className="w-full"
                            placeholder="Tìm kiếm..."
                            enterButton
                            onSearch={onSearch}
                            onChange={onChange}
                            onFocus={onFocus}
                        />
                        {state.openSearchResult && (
                            <div className="absolute top-10 w-full bg-white rounded-sm shadow-sm flex flex-col">
                                <Link
                                    to={`/category?searchKey=${state.searchKey}`}
                                    className="flex items-center px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100"
                                    onClick={() => setState({ openSearchResult: false })}
                                >
                                    <div>
                                        Tìm kiếm từ khóa <b>{state.searchKey}</b>
                                    </div>
                                </Link>
                                {state.newsResult.map(news => {
                                    return (
                                        <Link
                                            to={`/news/detail/${news.id}`}
                                            className="flex items-center px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100"
                                            key={news.id}
                                            onClick={() => setState({ openSearchResult: false })}
                                        >
                                            <span className="text-gray-500 mr-1">{news.title}</span>
                                            <span className="text-orange-500">trong {news.categoryName}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        <Button
                            type="primary"
                            danger
                            icon={<BaseIcon className="mr-1.5" icon="edit" />}
                            onClick={() => navigate('/news/create')}
                        >
                            Đăng tin
                        </Button>
                    </div>
                </div>
            </HomeContainer>
        </div>
    );
};

export default HomeHeader;
