import { Avatar, Button, Image } from 'antd';
import Search from 'antd/lib/input/Search';
import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { NewsSearch } from '~/types/home/news';
import LocaleUtil from '~/util/LocaleUtil';
import HomeContainer from '../layout/HomeContainer';
import { NEWS_SEARCH_API } from './../api/api';

interface State {
    openSearchResult: boolean;
    newsResult: NewsSearch[];
}

const HomeHeader: React.FC = () => {
    const [state, setState] = useMergeState<State>({
        openSearchResult: false,
        newsResult: [],
    });

    const navigate = useNavigate();

    const onSearch = _.debounce(async (value: string) => {
        const valueIgnoreSensitive = LocaleUtil.ignoreSensitive(value);
        const response = await requestApi<NewsSearch[]>(
            'get',
            NEWS_SEARCH_API,
            {},
            { params: { searchKey: valueIgnoreSensitive } },
        );
        if (response?.data?.success) {
            setState({
                newsResult: response?.data?.result || [],
            });
        }
    }, 350);

    const onChange = _.debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value.trim().length > 0) {
            const valueIgnoreSensitive = LocaleUtil.ignoreSensitive(value);
            const response = await requestApi<NewsSearch[]>(
                'get',
                NEWS_SEARCH_API,
                {},
                { params: { searchKey: valueIgnoreSensitive } },
            );
            if (response?.data?.success) {
                setState({
                    newsResult: response?.data?.result || [],
                });
            }
            !state.openSearchResult && setState({ openSearchResult: true });
        } else {
            state.openSearchResult && setState({ openSearchResult: false });
        }
    }, 350);

    const onBlur = () => {
        // state.openSearchResult && setState({ openSearchResult: false });
    };

    const onFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // if (value.trim().length > 0) {
        //     !state.openSearchResult && setState({ openSearchResult: true });
        // } else {
        //     state.openSearchResult && setState({ openSearchResult: false });
        // }
    };

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
                            src="https://static.chotot.com/storage/default/transparent_logo.webp"
                            //
                            height={35}
                            preview={false}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="mx-2 text-base flex items-center">
                            <BaseIcon icon="house" color="#fff" size="lg" className="mr-1.5" />
                            Trang chủ
                        </div>
                        <div className="flex items-center">
                            <Avatar className="mr-1.5">K</Avatar>
                            Anh Khoa Trần
                        </div>
                    </div>
                </div>
                <div className="h-[48%] flex justify-between">
                    <div className="relative w-[700px]">
                        <Search
                            className="w-full"
                            placeholder="Tìm kiếm..."
                            enterButton
                            onSearch={onSearch}
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                        {state.openSearchResult && (
                            <div className="absolute top-10 w-full bg-white rounded-sm shadow-sm flex flex-col">
                                {state.newsResult.map(news => {
                                    return (
                                        <Link
                                            to={`/news/detail/${news.id}`}
                                            className="flex items-center px-3 py-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-slate-100"
                                            key={news.id}
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
