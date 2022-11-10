import { Image } from 'antd';
import React from 'react';
import CarouselLayout from '../../layout/CarouselLayout';

const HomeCarousel: React.FC = () => {
    return (
        <CarouselLayout arrows={false} infinite>
            <Image
                src="https://cdn.chotot.com/admincentre/dWJYQ-sq5alSSN_IrXzZnmQqGQ462o6t_6xYeT4IbNE/preset:raw/plain/c252add5d8460ed7cc6ebac6d585e020-2795074145374429176.jpg"
                width={'100%'}
                preview={false}
            />
            <Image
                src="https://cdn.chotot.com/admincentre/dWJYQ-sq5alSSN_IrXzZnmQqGQ462o6t_6xYeT4IbNE/preset:raw/plain/c252add5d8460ed7cc6ebac6d585e020-2795074145374429176.jpg"
                width={'100%'}
                preview={false}
            />
            <Image
                src="https://cdn.chotot.com/admincentre/dWJYQ-sq5alSSN_IrXzZnmQqGQ462o6t_6xYeT4IbNE/preset:raw/plain/c252add5d8460ed7cc6ebac6d585e020-2795074145374429176.jpg"
                width={'100%'}
                preview={false}
            />
        </CarouselLayout>
    );
};

export default HomeCarousel;
