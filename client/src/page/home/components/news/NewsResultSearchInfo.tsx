import { Image } from 'antd';
import React from 'react';
import { NewsSearch } from '~/types/home/news';
import { VND_CHAR } from '~/configs';
import moment from 'moment';
import emptyImage from '~/assets/layout/empty.jpg';
import { Link } from 'react-router-dom';

interface Props {
    news: NewsSearch;
}

const NewsResultSearchInfo: React.FC<Props> = props => {
    const { news } = props;
    return (
        <Link to={`/news/detail/${news.id}`} className="p-3 cursor-pointer hover:shadow-linear-md flex h-[160px] bg-white" style={{ marginBottom: 1 }}>
            <div className="w-[140px] h-[140px] overflow-hidden">
                <Image
                    className="rounded object-cover"
                    src={news.imageUrls.length === 0 ? emptyImage : news.imageUrls[0]}
                    fallback={emptyImage}
                    preview={false}
                />
            </div>
            <div className="ml-2 h-full flex flex-col justify-between">
                <div>
                    <div className="text-base">{news.title}</div>
                    <div className="text-base font-bold text-red-500">
                        {news.price.toLocaleString()}
                        {' '}
                        {VND_CHAR}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="mr-2">{news.categoryName}</div>
                    <div className="mr-2">{moment(news.createdAt).fromNow()}</div>
                    <div>{news.provinceName}</div>
                </div>
            </div>
        </Link>
    );
};

export default NewsResultSearchInfo;
