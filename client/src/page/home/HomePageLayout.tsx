import clsx from 'clsx';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { RootState } from '~/AppStore';
import coinIcon from '~/assets/news/coin.svg';
import ChatBox from '~/component/Elements/ChatBox/ChatBox';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import LocaleUtil from '~/util/LocaleUtil';
import HomeFooter from './components/HomeFooter';
import HomeHeader from './components/HomeHeader';
import HomeContainer from './layout/HomeContainer';
import './styles/HomePage.scss';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const HomePageLayout: React.FC = () => {
    const { isShow } = useSelector((state: RootState) => state.chat);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const [display, setDisplay] = useState<boolean>(true);

    return (
        <div className="home flex flex-col justify-between relative">
            {display && (
                <div
                    className={clsx(
                        'fixed bottom-5 left-5 bg-white rounded-xl px-4 py-2 pt-3.5',
                        //
                        'shadow-linear-sm flex items-center flex-col',
                    )}
                    style={{ zIndex: 999999 }}
                >
                    <div className="flex items-center">
                        <span className="mr-2 font-bold text-lg">
                            {LocaleUtil.toLocaleString(authUser?.user?.amount ?? 0)}
                        </span>
                        <img src={coinIcon} alt="" width={32} height={32} />
                    </div>
                    <Link
                        to="/dashboard/balances"
                        className={clsx(
                            'm-auto w-full h-[30px] text-white bg-[#5a9e3f] uppercase',
                            'text-[13px] font-bold flex items-center justify-center rounded',
                            'hover:text-white mt-2 min-w-[90px]',
                        )}
                    >
                        Nạp Ngay
                    </Link>
                    <div className="absolute right-1.5 top-[3px] cursor-pointer" onClick={() => setDisplay(false)}>
                        <BaseIcon icon={faClose} />
                    </div>
                </div>
            )}
            <HomeHeader />
            <div className="home-main w-full bg-[#f4f4f4]">
                <HomeContainer>
                    <Outlet />
                </HomeContainer>
            </div>
            {isShow && <ChatBox />}
            <HomeFooter />
        </div>
    );
};

export default HomePageLayout;
