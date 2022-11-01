
import { Carousel, Image } from 'antd';
import React from 'react';

const HomeCarousel: React.FC = () => {
    return <div className="overflow-hidden rounded-xl ">
    <Carousel
        autoplay
        autoplaySpeed={4}
        arrows
        dots
        infinite
    >
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
    </Carousel>
</div>
};

export default HomeCarousel;
