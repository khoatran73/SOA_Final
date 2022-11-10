import React from 'react';
import BoxContainer from '../layout/BoxContainer';
import HomeCarousel from './main/HomeCarousel';
import HomeCategory from './main/HomeCategory';
import HomeNews from './main/HomeNews';

const HomeMain: React.FC = () => {
    return (
        <>
            <BoxContainer>
                <HomeCarousel />
            </BoxContainer>
            <BoxContainer className="flex flex-col">
                <HomeCategory />
            </BoxContainer>
            <BoxContainer className="flex flex-col">
                <HomeNews />
            </BoxContainer>
        </>
    );
};

export default HomeMain;
