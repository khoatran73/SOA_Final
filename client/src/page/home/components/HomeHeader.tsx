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
                            <BaseIcon icon="house" color="#000" size="sm" className="mr-1.5" />
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
                            <BaseIcon icon="house" color="#000" size="sm" className="mr-1.5" />
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
                                    <span className="mx-2">{authUser?.user.username}</span>
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
