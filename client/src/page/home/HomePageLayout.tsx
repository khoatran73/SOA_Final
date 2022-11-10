import React from 'react';
import { Outlet } from 'react-router';
import HomeFooter from './components/HomeFooter';
import HomeHeader from './components/HomeHeader';
import HomeContainer from './layout/HomeContainer';
import './styles/HomePage.scss';

const HomePageLayout: React.FC = () => {
    return (
        <div className="home flex flex-col justify-between overflow-y-auto">
            <HomeHeader />
            <div className="home-main w-full">
                <HomeContainer>
                    <Outlet />
                </HomeContainer>
            </div>
            <HomeFooter />
        </div>
    );
};

export default HomePageLayout;
