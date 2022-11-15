import React from 'react';
import { Outlet } from 'react-router';
import HomeFooter from './components/HomeFooter';
import HomeHeader from './components/HomeHeader';
import HomeContainer from './layout/HomeContainer';
import themeImage from '~/assets/layout/theme.png';
import './styles/HomePage.scss';

const HomePageLayout: React.FC = () => {
    return (
        <div className="home flex flex-col justify-between">
            <HomeHeader />
            <div
                className="home-main w-full"
                style={{
                    backgroundImage: `url({${themeImage}})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundSize: '100%',
                }}
            >
                <HomeContainer>
                    <Outlet />
                </HomeContainer>
            </div>
            <HomeFooter />
        </div>
    );
};

export default HomePageLayout;
