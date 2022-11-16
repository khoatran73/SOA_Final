import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import { RootState } from '~/AppStore';
import ChatBox from '~/component/Elements/ChatBox/ChatBox';
import HomeFooter from './components/HomeFooter';
import HomeHeader from './components/HomeHeader';
import HomeContainer from './layout/HomeContainer';
import themeImage from '~/assets/layout/theme.png';
import './styles/HomePage.scss';

const HomePageLayout: React.FC = () => {
    const { isShow } = useSelector((state: RootState) => state.chat);
    return (
        <div className="home flex flex-col justify-between">
            <HomeHeader />
            <div
                className="home-main w-full bg-[#f4f4f4]"
                // style={{
                //     backgroundImage: `url(${themeImage})`,
                //     backgroundRepeat: 'no-repeat',
                //     backgroundSize: 'cover',
                // }}
            >
                <HomeContainer>
                    <Outlet />
                </HomeContainer>
            </div>
            {isShow && <ChatBox/>}
            <HomeFooter />
        </div>
    );
};

export default HomePageLayout;
