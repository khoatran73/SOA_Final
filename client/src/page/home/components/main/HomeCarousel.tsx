import { Image } from 'antd';
import React from 'react';
import CarouselLayout from '../../layout/CarouselLayout';
import carousel1 from '~/assets/layout/carousel1.png';
import carousel2 from '~/assets/layout/carousel2.png';
import carousel3 from '~/assets/layout/carousel3.png';
import carousel4 from '~/assets/layout/carousel4.png';

const HomeCarousel: React.FC = () => {
    return (
        <CarouselLayout arrows={false} infinite>
            <Image width={'100%'} src={carousel1} preview={false} />
            <Image width={'100%'} src={carousel2} preview={false} />
            <Image width={'100%'} src={carousel3} preview={false} />
            <Image width={'100%'} src={carousel4} preview={false} />
        </CarouselLayout>
    );
};

export default HomeCarousel;
