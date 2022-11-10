import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Carousel, CarouselProps } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { BaseIcon } from '~/component/Icon/BaseIcon';

interface Props extends CarouselProps {
    children: React.ReactNode;
    wrapperClassName?: string;
}

const CarouselLayout: React.FC<Props> = props => {
    return (
        <div className={clsx('rounded-xl', props.wrapperClassName)}>
            <Carousel
                autoplay
                arrows
                dots={false}
                prevArrow={<BaseIcon icon={faChevronLeft} />}
                nextArrow={<BaseIcon icon={faChevronRight} />}
                infinite={false}
                {...props}
            >
                {props.children}
            </Carousel>
        </div>
    );
};

export default CarouselLayout;
