import React, { CSSProperties } from 'react';
import { ReactComponent as SpiralLoading } from '~/assets/layout/spiral.svg';

type LoadingProps = {
    text?: string;
    style?: CSSProperties;
};

const Loading: React.FC<LoadingProps> = props => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                zIndex: 999,
                backgroundColor: 'transparent',
                ...props.style
            }}
        >
            <SpiralLoading />
            <span>{props.text}</span>
        </div>
    );
};

export default Loading;
