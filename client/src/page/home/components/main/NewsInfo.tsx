import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Dropdown, Image, Menu } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { BaseIcon } from '~/component/Icon/BaseIcon';

interface Props {}

const NewsInfo: React.FC<Props> = props => {
    return (
        <div className="w-full hover:shadow-xl h-[320px] flex flex-col p-3 border-t border-solid border-gray-200 relative">
            <div className="w-full rounded overflow-hidden flex items-center justify-center">
                <Image
                    width={200}
                    height={200}
                    className="object-cover"
                    preview={false}
                    src="https://cdn.chotot.com/V_YzePtcQjqB5_typWKQqpnLMqYI3OUK45wrqwkiZqs/preset:listing/plain/3c931c5fd0299b6a78f8465021822132-2796562283343220181.jpg"
                />
            </div>
            <div className="line-clamp-2 h-[40px] mt-0.5" style={{ width: 'calc(100% - 16px)' }}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis laborum vero, laudantium ea optio soluta
                ex quos esse tempore dolorum, assumenda quia placeat cum voluptatum voluptate off
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
            <div className="text-red-500 text-base font-bold mt-1">25.000.000 đ</div>
            <div className="text-gray-500 text-xs line-clamp-1">
                <Avatar size={20}>.</Avatar>
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                40s truoc
                <span className='after:content-["\B7"] after:align-middle mx-1 h-full' />
                thành phố hồ chí minh hihi
            </div>
        </div>
    );
};

export default NewsInfo;
