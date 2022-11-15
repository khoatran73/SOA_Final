import React from 'react';
import BoxContainer from '../layout/BoxContainer';
import HomeCarousel from './main/HomeCarousel';
import HomeCategory from './main/HomeCategory';
import HomeIntro from './main/HomeIntro';
import HomeNews from './main/HomeNews';

const HomeMain: React.FC = () => {
    return (
        <>
            <BoxContainer>
                <HomeCarousel />
            </BoxContainer>
            <BoxContainer className="flex flex-col mt-2">
                <HomeCategory />
            </BoxContainer>
            <BoxContainer className="flex flex-col mt-2 px-0 pb-0">
                <HomeNews />
            </BoxContainer>
            <BoxContainer className="flex flex-col mt-2">
                <HomeIntro />
            </BoxContainer>
        </>
    );
};

export default HomeMain;
