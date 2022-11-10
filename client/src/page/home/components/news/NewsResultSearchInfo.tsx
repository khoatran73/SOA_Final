import { Image } from 'antd';
import React from 'react';

interface Props {
}

const NewsResultSearchInfo: React.FC<Props> = props => {
    return (
        <div className="p-3 cursor-pointer hover:shadow-linear-md flex h-[160px]">
            <div className="w-[140px] h-[140px] overflow-hidden">
                <Image
                    className="rounded object-cover"
                    src="https://cdn.chotot.com/xbzhu07bABfacHqY_g4CcDlTY8UliSv7myq7DiR2jDk/preset:listing/plain/235cd19270d32c3f96a7d2cb0bcf6d03-2797531809117587105.jpg"
                    preview={false}
                />
            </div>
            <div className="ml-2 h-full flex flex-col justify-between">
                <div>
                    <div className="text-base">Cơm phơi khô</div>
                    <div className="text-base font-bold text-red-500">4.000đ</div>
                </div>
                <div className="flex items-center">
                    <div className="mr-2">6 gio truolc</div>
                    <div>phuong phu yen</div>
                </div>
            </div>
        </div>
    );
};

export default NewsResultSearchInfo;
