import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const HomeContainer: React.FC<Props> = props => {
    return <div className={clsx('w-full h-full max-w-[1040px] my-0 mx-auto p-5', props.className)}>{props.children}</div>;
};

export default HomeContainer;
