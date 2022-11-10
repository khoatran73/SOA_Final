import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Dropdown, Image, Menu } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import emptyImage from '~/assets/layout/empty.jpg';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { NewsResponse } from '~/types/home/news';

interface Props {
    news: NewsResponse;
}

const NewsInfo: React.FC<Props> = props => {
    const { news } = props;
    return (
        <Link
            to={`/news/detail/${news.id}`}
            className="w-full hover:shadow-linear-sm h-[320px] flex flex-col p-3 relative"
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
            <div className="line-clamp-2 h-[40px] mt-0.5" style={{ width: 'calc(100% - 16px)' }}>
                {news.title}
            </div>
            <Dropdown
                className={clsx(
                    'absolute bottom-[80px] right-[12px] w-[20px] h-[20px] p-0.5 rounded-full',
                    ' hover:shadow cursor-pointer flex items-center justify-center',
                )}
                overlay={
                    <Menu
                        items={[
                            {
                                key: '1',
                                label: '1st menu item',
                            },
                            {
                                key: '2',
                                label: '2nd menu item',
                            },
                            {
                                key: '3',
                                label: '3rd menu item',
                            },
                        ]}
                    />
                }
                trigger={['click']}
            >
                <BaseIcon icon={faEllipsisVertical} />
            </Dropdown>
            <div className="text-red-500 text-base font-bold mt-1">{news.price?.toLocaleString()} VND</div>
            <div className="text-gray-500 text-xs line-clamp-1">
                <Avatar size={20}>.</Avatar>
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                {moment(news.createdAt).fromNow()}
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                {news.provinceName}
            </div>
        </Link>
    );
};

export default NewsInfo;
