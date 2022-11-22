import { Avatar, Image } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import emptyImage from '~/assets/layout/empty.jpg';
import cameraImage from '~/assets/news/camera.svg';
import priorityIcon from '~/assets/news/priority-gray.svg';
import { VND_CHAR } from '~/configs';
import { NewsSearch } from '~/types/home/news';
import DateTimeUtil from '~/util/DateTimeUtil';
import LocaleUtil from '~/util/LocaleUtil';
import heartIcon from '~/assets/news/heart.svg';
import defaultAvatar from '~/assets/default-avatar.png';

interface Props {
    news: NewsSearch;
}

const NewsResultSearchInfo: React.FC<Props> = props => {
    const { news } = props;
    return (
        <Link
            to={`/news/detail/${news.id}`}
            className="p-3 cursor-pointer hover:shadow-linear-md flex h-[160px] bg-white mb-1"
        >
            <div className="w-[140px] h-[140px] overflow-hidden relative">
                <Image
                    className="rounded object-cover"
                    src={news.imageUrls.length === 0 ? emptyImage : news.imageUrls[0]}
                    height={140}
                    width={140}
                    fallback={emptyImage}
                    preview={false}
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
            <div className="ml-2 h-full flex flex-col justify-between">
                <div>
                    <div className="text-[15px] text-[#222] line-clamp-1">{news.title}</div>
                    <div className="text-[15px] font-bold text-[#c90927]">
                        {LocaleUtil.toLocaleString(news.price)} {VND_CHAR}
                    </div>
                    <div className="text-orange-500 font-bold text-md">Danh mục: {news.categoryName}</div>
                </div>
                <div className="flex items-center text-xs text-[#9b9b9b]">
                    <div className="flex items-center ">
                        <Avatar size={18} src={!news?.avatar ? defaultAvatar : news?.avatar} /> <span className="ml-1">{news.fullName}</span>
                    </div>
                    {DateTimeUtil.checkExpirationDate(news.bumpPriority?.toDate) && (
                        <>
                            <span className="mx-1.5">·</span>
                            <div className="flex items-center justify-center">
                                <img src={priorityIcon} alt="" />
                                <span className="ml-1">Tin ưu tiên</span>
                            </div>
                        </>
                    )}
                    <span className="mx-1.5">·</span>
                    <div className="">{DateTimeUtil.fromNow(news?.createdAt)}</div>
                    <span className="mx-1.5">·</span>
                    <div>{news.provinceName}</div>
                </div>
            </div>
        </Link>
    );
};

export default NewsResultSearchInfo;
