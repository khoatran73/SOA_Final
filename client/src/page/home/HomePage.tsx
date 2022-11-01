import React from 'react';
import HomeMain from './components/HomeMain';
import HomeFooter from './components/HomeFooter';
import HomeHeader from './components/HomeHeader';
import './styles/HomePage.scss';

const HomePage: React.FC = () => {
    return (
        <div className="home flex flex-col justify-between overflow-y-auto">
            <HomeHeader />
            <HomeMain />
            <HomeFooter />
        </div>
    );
};

export default HomePage;
