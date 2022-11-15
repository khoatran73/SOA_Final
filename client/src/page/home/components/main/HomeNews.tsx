import React from 'react';
import NewsInfo from './NewsInfo';
import { NewsResponse } from '~/types/home/news';
import { NEWS_NEWEST_API } from '../../api/api';
import { requestApi } from '~/lib/axios';
import { useQuery } from 'react-query';
import ErrorView from '~/component/Layout/ErrorView';
import Loading from '~/component/Elements/loading/Loading';

const getNewsNewest = () => {
    return requestApi<NewsResponse[]>('get', NEWS_NEWEST_API);
};

const HomeNews: React.FC = () => {
    const { data: requestNews, isLoading, isError } = useQuery(['GET_NEWS_NEWEST'], getNewsNewest);
    const listNews = requestNews?.data?.result;

    if (isError) return <ErrorView />;
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="uppercase font-bold mb-1 px-3">Tin đăng mới</div>
            <div className="flex flex-wrap px-3 pb-3">
                {listNews?.map(news => {
                    if (!news) return null;
                    return (
                        <div className="flex flex-col items-center justify-center w-[20%]" key={news?.id}>
                            <NewsInfo news={news} />
                        </div>
                    );
                })}
            </div>
            <div className="w-full h-10 flex items-center justify-center bg-[#f4f4f4] text-[#38699f] text-base font-bold cursor-pointer">Xem thêm</div>
        </>
    );
};

export default HomeNews;
