import { Tabs } from 'antd';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import LocaleUtil from '~/util/LocaleUtil';
import coinIcon from '~/assets/news/coin.svg';

import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import { useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import { useEffect, useState } from 'react';
import { TRANSACTION_HISTORY_API } from '~/configs';
import { requestApi } from '~/lib/axios';
import moment from 'moment';
import { TransactionHistoryType } from '~/types/home/history';
import DateTimeUtil from '~/util/DateTimeUtil';


const ItemHistory = (props: TransactionHistoryType) => {
    return (
        <div className="w-full h-[auto] mx-auto py-2 px-3 border border-[#ebeaea] mt-3">
            <div className="flex justify-between">
                <span className="text-lg text-[#f35c5c]">
                    {props.title}
                </span>
                <span className="text-xs text">{moment(props.createdAt).format(DateTimeUtil.DmyHmsFormat)}</span>
            </div>
            <div>
                <span className="text-md">
                    Hinh thức: <b className='text-[#e06d6d]'>{props.paymentMethod}</b>
                </span>
            </div>
            <div>
                <span>
                    Số tiền: <b className='text-[#e06d6d]'>{LocaleUtil.toLocaleString(props.totalVnd ?? 0)} đ</b>
                </span>
            </div>
        </div>
    );
};
const TransactionHistory = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const [history, setHistory] = useState<any>([]);
    useEffect(() => {
        const userId = authUser?.user.id;
        requestApi('get', TRANSACTION_HISTORY_API, { id: userId }).then(res => {
            setHistory(res.data.result);
        });
    },[])
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
                                title: 'Lịch sử giao dịch',
                                link: '/dashboard/history',
                            },
                        ]}
                    />
                    <div className="w-full float-left relative">
                        <h1 className="flex items-center bg-white py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                            Lịch sử giao dịch
                        </h1>
                        <div className="w-full text-[13px]">
                            <Tabs defaultActiveKey="1" className="">
                                <Tabs.TabPane tab={'Lịch sử giao dịch'} key="1">
                                    <h1 className="flex items-center bg-slate-50 py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                                        Đơn hàng
                                    </h1>
                                    <div className="w-full py-2 px-3 border-b border-[#dbdbdb] bg-white">
                                        {history.map((item: any, index: number) => {
                                            return (
                                                <div key={index} >
                                                    <ItemHistory {...item} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="block relative w-1/4 col-md-3 ml-2 ">
                    <div className="bg-white rounded p-3">
                        <div className="w-full float-left relative p-2.5 h-[85px] flex">
                            <div className="_2ZIVS1lDi3cofxmi0NnPnf">
                                <img src={coinIcon} alt=" " width="55" height="55" />
                            </div>
                            <div className="text-[12px] font-semibold w-[calc(100% - 60px)] text-left float-right mt-2.5 ml-2.5">
                                <p>Tài khoản Coin</p>
                                <span className="text-lg">{LocaleUtil.toLocaleString(authUser?.user.amount ?? 0)}</span>
                            </div>
                        </div>

                        <div className="w-full">
                            <Link
                                to="/dashboard/balances"
                                className={clsx(
                                    'm-auto w-full h-[30px] text-white bg-[#5a9e3f] uppercase hover:text-white',
                                    'text-[13px] font-bold flex items-center justify-center rounded',
                                )}
                            >
                                Nạp Ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </BoxContainer>
    );
};
export default TransactionHistory;
