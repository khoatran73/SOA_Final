import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Dropdown, Image, Menu } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import emptyImage from '~/assets/layout/empty.jpg';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { VND_CHAR } from '~/configs';
import { NewsResponse } from '~/types/home/news';

interface Props {
    news: NewsResponse;
}

const NewsInfo: React.FC<Props> = props => {
    const { news } = props;
    return (
        <Link
            to={`/news/detail/${news.id}`}
            className="w-full hover:shadow-linear-sm h-[320px] flex flex-col p-3 relative border border-[#f4f4f4]"
        >
            <div className="w-full rounded overflow-hidden flex items-center justify-center">
                <Image
                    width={200}
                    height={200}
                    className="object-cover"
                    preview={false}
                    src={news?.imageUrls[0]}
                    fallback={emptyImage}
                />
            </div>
            <div className="mb-2">
                <div className="line-clamp-2 h-[40px] mt-0.5 text-[#222]" style={{ width: 'calc(100% - 16px)' }}>
                    {news.title}
                </div>
                <div className="text-[#d0021b] text-base font-bold mt-1">
                    {news.price?.toLocaleString()} {VND_CHAR}
                </div>
            </div>
            <div className="text-[#9b9b9b] text-xs line-clamp-1 text-[10px]">
                <Avatar size={20}>a</Avatar>
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                {moment(news.createdAt).fromNow()}
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                {news.provinceName}
            </div>
        </Link>
    );
};

export default NewsInfo;
