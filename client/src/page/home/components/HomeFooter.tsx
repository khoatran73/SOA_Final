import clsx from 'clsx';
import React from 'react';

const HomeFooter: React.FC = () => {
    return (
        <div
            className={clsx(
                'home-footer bg-green-200 text-sm w-full flex items-center justify-end',
                //
            )}
        >
            This is footer
        </div>
    );
};

export default HomeFooter;
