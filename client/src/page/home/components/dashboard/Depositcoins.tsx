import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { VND_CHAR } from '~/configs';

import LocaleUtil from '~/util/LocaleUtil';
import coinIcon from '~/assets/news/coin.svg';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import BuyCoinModel from './components/BuyCoinModel';
import { RootState } from '~/AppStore';
import { useDispatch, useSelector } from 'react-redux';
import { AuthUser } from '~/types/ums/AuthUser';
import { requestApi } from '~/lib/axios';
import { API_GET_USER } from '~/configs';
import { authSlice } from '~/store/authSlice';
const OptionCoins = (props: any) => {
    return (
        <div className="w-[80%] h-[70px] mx-auto flex py-2 px-3 relative cursor-pointer border border-[#ebeaea] mt-2">
            <div className="_2ZIVS1lDi3cofxmi0NnPnf flex items-center w-auto mx-auto ">
                <span className="mr-2 text-2xl text-black-600">
                    Nạp {LocaleUtil.toLocaleString(props.number)} {VND_CHAR}{' '}
                </span>
                <img src={coinIcon} alt=" " width="35" height="35" />
                <i className="ml-3">
                    Giá {LocaleUtil.toLocaleString(props.number)} {VND_CHAR}
                </i>
                <BaseIcon icon={faArrowRight} className="mr-1 absolute right-2" size="sm" />
            </div>
        </div>
    );
};
const DepositCoins: React.FC = () => {
    const listCoins = [8000000, 5000000, 3000000, 1500000, 1000000, 500000, 100000, 50000, 20000];
    const modalRef = useRef<ModalRef>(null);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const dispatch = useDispatch()
    const {setAuthData} = authSlice.actions;
    const [user, setUser] = useState<AuthUser>();
    useEffect(() => {
        const userId = authUser?.user.id;
        requestApi('get', API_GET_USER, { id: userId }).then(res => {
            setUser(res.data.result);
            dispatch(setAuthData(res.data.result));
        });
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
            'Thanh toán đồng tốt',
            '60%',
        );
    };
    return (
        <BoxContainer className="p-0 bg-transparent dashboard">
            <div className="relative flex">
                <div className="relative w-3/4 col-md-3 mr-2 pb-0 mb-10">
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
                                title: 'Tài khoản đồng tốt',
                                link: '/news/dashboard',
                            },
                        ]}
                    />
                    <div className="w-full float-left relative">
                        <h1 className="flex items-center bg-white py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                            Tài khoản đồng tốt
                        </h1>
                        <div className="w-full text-[13px]">
                            <Tabs defaultActiveKey="1" className="">
                                <Tabs.TabPane tab={'Tổng số dư'} key="1">
                                    <div className="w-full flex py-2 px-3 border-b border-[#dbdbdb] bg-white">
                                        <div className="_2ZIVS1lDi3cofxmi0NnPnf flex items-center w-auto mx-auto">
                                            <span className="mr-2 text-2xl text-blue-600">
                                                {LocaleUtil.toLocaleString(user?.user.amount ?? 0)}
                                            </span>
                                            <img src={coinIcon} alt=" " width="35" height="35" />
                                        </div>
                                    </div>
                                    <h1 className="flex items-center bg-slate-50 py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                                        Nạp đồng tốt
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
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={'Nạp đồng tốt'} key="2">
                                    <h1 className="flex items-center bg-slate-50 py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                                        Nạp đồng tốt
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
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <ModalBase ref={modalRef} />
        </BoxContainer>
    );
};

export default DepositCoins;
