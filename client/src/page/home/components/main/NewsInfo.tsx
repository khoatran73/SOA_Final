import { Avatar, Image } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import emptyImage from '~/assets/layout/empty.jpg';
import cameraImage from '~/assets/news/camera.svg';
import heartIcon from '~/assets/news/heart.svg';
import { VND_CHAR } from '~/configs';
import { NewsResponse } from '~/types/home/news';
import DateTimeUtil from '~/util/DateTimeUtil';
import LocaleUtil from '~/util/LocaleUtil';
import defaultAvatar from '~/assets/default-avatar.png';

interface Props {
    news: NewsResponse;
}

const NewsInfo: React.FC<Props> = props => {
    const { news } = props;

    return (
        <Link
            to={`/news/detail/${news.id}`}
            className="w-full hover:shadow-linear-sm h-[325px] flex flex-col p-3 relative border border-[#f4f4f4]"
        >
            <div className="w-full rounded overflow-hidden flex items-center justify-center relative">
                <Image
                    width={200}
                    height={200}
                    className="object-cover"
                    preview={false}
                    src={news?.imageUrls[0]}
                    fallback={emptyImage}
                />
                <div
                    className={clsx(
                        'absolute w-6 h-5 flex items-center justify-center text-white ',
                        'font-bold text-[10px] top-1 left-1',
                    )}
                    style={{ backgroundImage: `url(${cameraImage})` }}
                >
                    {news?.imageUrls.length}
                </div>
                <img
                    className={clsx(
                        'absolute flex items-center justify-center text-white ',
                        'font-bold text-[10px] bottom-1 right-1',
                    )}
                    width={20}
                    height={20}
                    src={heartIcon}
                />
            </div>
            <div className="mb-2">
                <div className="line-clamp-2 h-[40px] mt-0.5 text-[#222]" style={{ width: 'calc(100% - 16px)' }}>
                    {news.title}
                </div>
                <div className="text-[#d0021b] text-base font-bold mt-1">
                    {LocaleUtil.toLocaleString(news.price)} {VND_CHAR}
                </div>
            </div>
            <div className="text-[#9b9b9b] text-xs line-clamp-1 text-[10px]">
                <Avatar size={20} src={!news?.avatar ? defaultAvatar : news?.avatar} />
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                {DateTimeUtil.fromNow(news?.createdAt)}
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                {news.provinceName}
            </div>
        </Link>
    );
};

export default NewsInfo;
