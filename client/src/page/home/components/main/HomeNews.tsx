import React from 'react';
import NewsInfo from './NewsInfo';

interface Props {}

const HomeNews: React.FC<Props> = props => {
    return (
        <>
            <div className="uppercase font-bold mb-1">Tin đăng mới</div>
            <div className="flex flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <div className="flex flex-col items-center justify-center w-[20%]" key={num}>
                        <NewsInfo />
                    </div>
                ))}
            </div>
            <div className="w-full h-[32px] flex items-center justify-center bg-gray-200">
                Xem thêm
            </div>
        </>
    );
};

export default HomeNews;
