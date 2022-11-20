import { Tabs } from 'antd';
import React from 'react';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import BuyerOrderView from './BuyerOrderView';
import SellerOrderView from './SellerOrderView';

const OrderView: React.FC = () => {
    return (
        <BoxContainer className="p-0 bg-transparent dashboard">
            <div className="flex flex-col">
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
                            title: 'Quản lý đơn hàng',
                            link: '/news/my-orders',
                        },
                    ]}
                />
                <div className="w-full float-left relative">
                    <h1 className="flex items-center bg-white py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                        Quản lý đơn hàng
                    </h1>
                </div>
                <div>
                    <Tabs defaultActiveKey="1" className="">
                        <Tabs.TabPane tab={'Đơn mua'} key="1">
                            <BuyerOrderView />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={'Đơn bán'} key="2">
                            <SellerOrderView />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </BoxContainer>
    );
};

export default OrderView;
