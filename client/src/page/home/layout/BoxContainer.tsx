import clsx from 'clsx';
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
}

const BoxContainer: React.FC<Props> = props => {
    return (
        <div className={clsx('p-3 bg-white rounded-sm relative', props.className)}>
            {props.children}
        </div>
    );
};

export default BoxContainer;
