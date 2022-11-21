import { Tabs } from 'antd';
import React from 'react';
import BoxContainer from '~/page/home/layout/BoxContainer';
import HomeBreadCrumb from '~/page/home/layout/HomeBreadCrumb';
import StatisticCoin from './StatisticCoin';

const StatisticView: React.FC = () => {
    return (
        <BoxContainer className="p-0 bg-transparent dashboard">
            <div className="relative flex flex-col">
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
                            title: 'Thống kê',
                        },
                    ]}
                />
                <div className="w-full float-left relative">
                    <h1 className="flex items-center bg-white py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                        Thống kê
                    </h1>
                </div>
                <div className="w-full text-[13px]">
                    <Tabs defaultActiveKey="1" className="">
                        <Tabs.TabPane tab={'Coin đã nạp'} key="1">
                            <StatisticCoin />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </BoxContainer>
    );
};

export default StatisticView;
