import React, { useState } from 'react';
import NewsInfo from './NewsInfo';
import { NewsResponse } from '~/types/home/news';
import { NEWS_NEWEST_API } from '../../api/api';
import { requestApi, PaginatedList } from '~/lib/axios';
import { useQuery } from 'react-query';
import ErrorView from '~/component/Layout/ErrorView';
import Loading from '~/component/Elements/loading/Loading';
import clsx from 'clsx';

const getNewsNewest = (limit: number) => {
    return requestApi<PaginatedList<NewsResponse>>('get', NEWS_NEWEST_API, {}, { params: { limit } });
};

const DefaultLimitNewsNewest = 10;

const HomeNews: React.FC = () => {
    const [limit, setLimit] = useState<number>(DefaultLimitNewsNewest);
    const { data: requestNews, isLoading } = useQuery(['GET_NEWS_NEWEST', limit], () => getNewsNewest(limit));
    const listNews = requestNews?.data?.result?.items;
    const totalCount = requestNews?.data?.result?.totalCount ?? 0;

    return (
        <>
            <div className="uppercase font-bold mb-1 px-3 text-[#222]">Tin đăng mới</div>
            <div className="flex flex-wrap px-3 pb-3">
                {isLoading ? (
                    <Loading />
                ) : (
                    listNews?.map(news => {
                        if (!news) return null;
                        return (
                            <div className="flex flex-col items-center justify-center w-[20%]" key={news?.id}>
                                <NewsInfo news={news} />
                            </div>
                        );
                    })
                )}
            </div>
            {totalCount > limit ? (
                <div
                    className={clsx(
                        'w-full h-10 flex items-center justify-center bg-[#f4f4f4]',
                        'text-[#38699f] text-base font-bold cursor-pointer',
                    )}
                    onClick={() => setLimit(prev => prev + DefaultLimitNewsNewest)}
                >
                    Xem thêm
                </div>
            ) : (
                <div
                    className={clsx(
                        'w-full h-10 flex items-center justify-center bg-[#f4f4f4]',
                        'text-[#9b9b9b] text-base font-bold',
                    )}
                >
                    Không còn tin nào khác
                </div>
            )}
        </>
    );
};

export default HomeNews;
