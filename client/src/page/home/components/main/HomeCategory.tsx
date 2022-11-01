import { Image } from 'antd';
import React from 'react';

const HomeCategory: React.FC = () => {
    return (
        <>
            <div className="uppercase font-bold mb-1">Danh mục</div>
            <div className="flex flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <div className="flex flex-col items-center justify-center my-1.5 w-[12.5%]" key={num}>
                        <Image
                            width={84}
                            src="https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fstatic.chotot.com%2Fstorage%2Fchapy-pro%2Fnewcats%2Fv8%2F1000.png&w=256&q=95"
                            preview={false}
                            //
                        />
                        <div className="mt-1">Bat dong san</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default HomeCategory;
