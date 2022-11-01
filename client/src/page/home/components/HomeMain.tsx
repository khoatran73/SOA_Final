import clsx from 'clsx';
import React from 'react';
import HomeContainer from '../layout/HomeContainer';
import HomeCarousel from './main/HomeCarousel';
import HomeCategory from './main/HomeCategory';
import HomeNews from './main/HomeNews';

const HomeMain: React.FC = () => {
    return (
        <div
            className={clsx(
                'home-main w-full ',
                //
            )}
        >
            <HomeContainer className="bg-blue-100 pt-2">
                <div className="p-3 bg-white rounded-sm">
                    <HomeCarousel />
                </div>
                <div className="p-3 mt-4 bg-white rounded-sm flex flex-col">
                    <HomeCategory />
                </div>
                <div className="p-3 mt-4 bg-white rounded-sm flex flex-col">
                    <HomeNews />
                </div>
            </HomeContainer>
        </div>
    );
};

export default HomeMain;
