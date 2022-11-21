import { CaretDownFilled, UserOutlined } from '@ant-design/icons';
import { faCoins, faLock, faSignOut, faUserAlt } from '@fortawesome/free-solid-svg-icons';
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

type Action = 'adminPage' | 'logout' | 'profile' | 'statistic';

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
            case 'profile':
                navigate('/user/info/' + authUser?.user.id);
                return;
            case 'adminPage':
                navigate('/admin/home');
                return;
            case 'statistic':
                navigate('/dashboard/statistic');
                return;
            case 'logout':
                dispatch(logoutAsync(() => null));
                return;
        }
    };

    const menu = (
        <Menu>
            <Menu.Item key="profile" onClick={() => onActionClick('profile')}>
                <div className="flex items-center justify-start">
                    <BaseIcon icon={faUserAlt} />
                    <span className="ml-3">Trang cá nhân</span>
                </div>
            </Menu.Item>
            {authUser?.user.isSupper && (
                <Menu.Item key="adminPage" onClick={() => onActionClick('adminPage')}>
                    <div className="flex items-center justify-start">
                        <BaseIcon icon={faLock} />
                        <span className="ml-3">Trang quản trị</span>
                    </div>
                </Menu.Item>
            )}
            <Menu.Item key="statistic" onClick={() => onActionClick('statistic')}>
                <div className="flex items-center justify-start">
                    <BaseIcon icon={faCoins} />
                    <span className="ml-3">Thống kê</span>
                </div>
            </Menu.Item>
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
                        <Link
                            to="/order/my-orders"
                            className={clsx(
                                'h-9 cursor-pointer flex items-center mx-1.5 justify-center rounded ',
                                'text-black px-2 hover:bg-gray-200 hover:bg-opacity-50 duration-75 mx-2 text-base',
                                'hover:text-black',
                            )}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="aw__i18qqx8k"
                            >
                                <rect
                                    x="4.6"
                                    y="6.6"
                                    width="14.8"
                                    height="14.8"
                                    rx="1.4"
                                    stroke="#222222"
                                    strokeWidth="1.2"
                                />
                                <path
                                    d="M12.0004 1.3999C9.45988 1.3999 7.40039 3.45939 7.40039 5.9999V6.0999H8.60039V5.9999C8.60039 4.12213 10.1226 2.5999 12.0004 2.5999C13.8782 2.5999 15.4004 4.12213 15.4004 5.9999V6.0999H16.6004V5.9999C16.6004 3.45939 14.5409 1.3999 12.0004 1.3999Z"
                                    fill="#222222"
                                />
                                <path
                                    d="M12.0004 3.3999C10.5645 3.3999 9.40039 4.56396 9.40039 5.9999V6.0999H10.6004V5.9999C10.6004 5.2267 11.2272 4.5999 12.0004 4.5999C12.7736 4.5999 13.4004 5.2267 13.4004 5.9999V6.0999H14.6004V5.9999C14.6004 4.56396 13.4363 3.3999 12.0004 3.3999Z"
                                    fill="#222222"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8 8V9.71429C8 10.1877 8.38376 10.5714 8.85714 10.5714C9.33053 10.5714 9.71429 10.1877 9.71429 9.71429V8H8Z"
                                    fill="#222222"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M14.29 8V9.71429C14.29 10.1877 14.6738 10.5714 15.1472 10.5714C15.6206 10.5714 16.0043 10.1877 16.0043 9.71429V8H14.29Z"
                                    fill="#222222"
                                />
                            </svg>
                            Đơn hàng
                        </Link>
                        <Link
                            to="/chat"
                            className={clsx(
                                'h-9 cursor-pointer flex items-center mx-1.5 justify-center rounded ',
                                'text-black px-2 hover:bg-gray-200 hover:bg-opacity-50 duration-75 mx-2 text-base',
                                'hover:text-black',
                            )}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                type="monochrome"
                                xmlns="http://www.w3.org/2000/svg"
                                className="aw__i6btuqv mr-1"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.54315 14.1884C5.39767 14.1884 5.26041 14.2418 5.15737 14.3383L3.32586 16.0491V14.6989C3.32586 14.4174 3.08144 14.1884 2.78111 14.1884H2.38803C2.36129 14.1884 2.31155 14.1858 2.19112 14.1736C1.82179 14.1247 1.09173 13.9107 1.09173 12.9782V6.22901C1.09173 6.10509 1.128 5.01668 2.38803 5.01668H14.7521C14.9692 5.01964 16.0531 5.0912 16.0531 6.22674V6.31523C16.0531 6.59553 16.2977 6.82365 16.5982 6.82365C16.8987 6.82365 17.1432 6.59553 17.1432 6.31523V6.22674C17.1432 4.46549 15.5807 4 14.7546 4H2.38803C0.499112 4 0 5.45668 0 6.22691V12.9782C0 14.637 1.38289 15.1475 2.23432 15.2021V17.2775C2.23432 17.4817 2.36578 17.6662 2.57448 17.7495C2.64011 17.7735 2.70968 17.7858 2.7813 17.7858C2.92716 17.7858 3.06798 17.7306 3.16597 17.6364L5.92913 15.0574C6.14138 14.8591 6.14119 14.5362 5.92913 14.3381C5.82572 14.2416 5.68864 14.1884 5.54315 14.1884ZM23.5163 8.14113C23.219 7.76134 22.6472 7.30859 21.6123 7.30859H9.22929C8.40329 7.30859 6.84106 7.77461 6.84106 9.53777V16.4159C6.84106 18.1793 8.40329 18.6453 9.22929 18.6453H11.9921C12.2924 18.6453 12.537 18.417 12.537 18.1367C12.537 17.8551 12.2924 17.6261 11.9921 17.6261H9.22929C9.09651 17.6261 7.93298 17.5921 7.93298 16.4159V9.53795C7.93298 8.36192 9.09651 8.32789 9.22929 8.32789H21.6123C22.8295 8.32789 22.9076 9.3381 22.911 9.53795V16.4161C22.911 17.5923 21.7452 17.6263 21.6123 17.6263H16.5987C16.2982 17.6263 16.0536 17.8553 16.0536 18.1368V19.4874L14.22 17.7754C14.0072 17.578 13.6613 17.5778 13.449 17.7755C13.3456 17.8721 13.2886 17.9998 13.2888 18.1358C13.2888 18.2716 13.3456 18.3992 13.449 18.4953L16.2116 21.0741C16.315 21.1708 16.4525 21.224 16.5985 21.224C16.6688 21.224 16.738 21.2115 16.8076 21.1853C17.0116 21.1045 17.1436 20.92 17.1436 20.7153V18.6453H21.6121C22.4381 18.6453 24.0003 18.1793 24.0003 16.4159V9.53795C24.0003 9.35521 23.9655 8.71449 23.5163 8.14113ZM20.6924 11.1439H10.1508C9.84935 11.1439 9.604 10.9156 9.604 10.6352C9.604 10.354 9.84935 10.125 10.1508 10.125H20.6924C20.9929 10.125 21.2373 10.354 21.2373 10.6352C21.2373 10.9156 20.9929 11.1439 20.6924 11.1439ZM10.1508 13.4854H20.6924C20.9929 13.4854 21.2373 13.2573 21.2373 12.977C21.2373 12.6967 20.9929 12.4688 20.6924 12.4688H10.1508C9.84935 12.4688 9.604 12.6967 9.604 12.977C9.604 13.2573 9.84935 13.4854 10.1508 13.4854ZM20.6924 15.8311H10.1508C9.84935 15.8311 9.604 15.603 9.604 15.3228C9.604 15.0415 9.84935 14.8125 10.1508 14.8125H20.6924C20.9929 14.8125 21.2373 15.0415 21.2373 15.3228C21.2373 15.603 20.9929 15.8311 20.6924 15.8311Z"
                                    fill="#222222"
                                />
                            </svg>
                            Chat
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
                                        src={authUser?.user.avatar}
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
