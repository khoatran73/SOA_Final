import { faArrowRight, faCoins } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { RootState } from '~/AppStore';
import coinBlackIcon from '~/assets/coin-black.png';
import coinIcon from '~/assets/news/coin.svg';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { VND_CHAR } from '~/configs';
import { fetchAuthDataAsync } from '~/store/authSlice';
import LocaleUtil from '~/util/LocaleUtil';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import BuyCoinModel from './components/BuyCoinModel';

const OptionCoins = (props: any) => {
    return (
        <div className="w-[600px] h-[68px] mx-auto flex relative cursor-pointer border border-[#eee] mt-2 rounded-md text-[13px]">
            <div className="flex items-center justify-between p-2.5">
                <div className="flex items-center">
                    <span className="mr-2 font-bold">
                        Nạp {LocaleUtil.toLocaleString(props.number)} {VND_CHAR}{' '}
                    </span>
                    <img src={coinBlackIcon} alt=" " width="23" height="23" />
                    <i className="ml-2">
                        Giá {LocaleUtil.toLocaleString(props.number)} {VND_CHAR}
                    </i>
                </div>
                <BaseIcon icon={faArrowRight} className="mr-1 absolute right-2" size="sm" />
            </div>
        </div>
    );
};

const DepositCoins: React.FC = () => {
    const listCoins = [8000000, 5000000, 3000000, 1500000, 1000000, 500000, 100000, 50000, 20000];
    const modalRef = useRef<ModalRef>(null);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('reload') === 'load') {
            setSearchParams({} as Record<string, any>);
            window.location.reload();
        }
    }, []);

    const handleBuyCoin = (item: number) => {
        modalRef.current?.onOpen(
            <BuyCoinModel
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                }}
                onClose={modalRef.current?.onClose}
                money={item}
            />,
            'Nạp Coin',
            '40%',
            faCoins,
        );
    };
    return (
        <BoxContainer className="p-0 bg-transparent dashboard">
            <div className="relative flex">
                <div className="relative w-full pb-0 mb-10">
                    <HomeBreadCrumb
                        className="py-2 px-3 bg-white"
                        style={{
                            margin: 0,
                        }}
                        item={[
                            {
                                title: 'Trang chủ',
                                link: '/',
                            },
                            {
                                title: 'Tài khoản Coin',
                                link: '/news/dashboard',
                            },
                        ]}
                    />
                    <div className="w-full float-left relative">
                        <h1 className="flex items-center bg-white py-2 px-3 justify-between font-bold text-base ">
                            Tài khoản Coin
                        </h1>
                        <div className="w-full text-[13px]">
                            <div className="w-full flex py-2 px-3 border-b border-[#dbdbdb] bg-white items-center justify-center">
                                <div className="flex items-center w-[600px]">
                                    <div className="flex-1 text-left flex items-center">
                                        <span className="mr-2 text-2xl text-[#589f39]">
                                            {LocaleUtil.toLocaleString(authUser?.user.amount ?? 0)}
                                        </span>
                                        <img src={coinIcon} alt=" " width="35" height="35" />
                                    </div>
                                    <Link
                                        to={'/dashboard/history'}
                                        className="flex-1 text-right text-[#4a90e2] hover:text-[#4a90e2] hover:underline"
                                    >
                                        Xem lịch sử giao dịch
                                    </Link>
                                </div>
                            </div>
                            <h1 className="flex items-center py-2 px-3 justify-between font-bold text-base">
                                Nạp Coin
                            </h1>
                            <div className="w-full py-2 px-3 border-b border-[#dbdbdb] bg-white">
                                {listCoins.map((item: number, index: number) => {
                                    return (
                                        <div key={index} onClick={() => handleBuyCoin(item)}>
                                            <OptionCoins number={item} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalBase ref={modalRef} />
        </BoxContainer>
    );
};

export default DepositCoins;
