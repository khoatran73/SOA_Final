import { Empty, Tabs } from 'antd';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import Loading from '~/component/Elements/loading/Loading';
import { requestApi } from '~/lib/axios';
import { OrderAction, OrderResponse, OrderStatus } from '~/types/home/order';
import { GET_ORDERS_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import OrderItem from './OrderItem';

const getOrders = () => {
    return requestApi<OrderResponse[]>('get', GET_ORDERS_API, {}, { params: { action: OrderAction.Sell } });
};

const SellerOrderView: React.FC<{ activeKey?: string }> = ({ activeKey }) => {
    const [reSend, setReSend] = useState<boolean>(false);
    const { data: requestOrders, isLoading } = useQuery([`GET_ORDERS_SELL_${activeKey}`, reSend], getOrders);
    const orders = requestOrders?.data.result ?? [];
    const ordersWaiting = orders.filter(x => x.status === OrderStatus.Waiting);
    const ordersConfirm = orders.filter(x => x.status === OrderStatus.Confirm);
    const ordersShipping = orders.filter(x => x.status === OrderStatus.Shipping);
    const ordersDone = orders.filter(x => x.status === OrderStatus.Done);
    const [searchParams, setSearchParams] = useSearchParams();

    if (isLoading) return <Loading />;
    return (
        <BoxContainer className="p-0 bg-transparent dashboard">
            <div className="w-full text-[13px]">
                <Tabs
                    defaultActiveKey={searchParams.get('activeTab') ?? OrderStatus.Waiting}
                    onChange={tab =>
                        setSearchParams({
                            activeKey: activeKey ?? '',
                            activeTab: tab,
                        } as Record<string, any>)
                    }
                >
                    <Tabs.TabPane
                        className="min-h-[200px]"
                        tab={`Chờ xác nhận (${ordersWaiting.length})`}
                        key={OrderStatus.Waiting}
                    >
                        {ordersWaiting.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersWaiting.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem setReSend={setReSend} action={OrderAction.Sell} item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        className="min-h-[200px]"
                        tab={`Chốt đơn (${ordersConfirm.length})`}
                        key={OrderStatus.Confirm}
                    >
                        {ordersConfirm.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersConfirm.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem setReSend={setReSend} action={OrderAction.Sell} item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        className="min-h-[200px]"
                        tab={`Đang giao (${ordersShipping.length})`}
                        key={OrderStatus.Shipping}
                    >
                        {ordersShipping.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersShipping.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem setReSend={setReSend} action={OrderAction.Sell} item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        className="min-h-[200px]"
                        tab={`Đã giao (${ordersDone.length})`}
                        key={OrderStatus.Done}
                    >
                        {ordersDone.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersDone.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem setReSend={setReSend} action={OrderAction.Sell} item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    {/* <Tabs.TabPane className="min-h-[200px]" tab={'Hoàn tiền/ Đã hủy'} key="5">
                        hoan tien, da huy
                    </Tabs.TabPane> */}
                </Tabs>
            </div>
        </BoxContainer>
    );
};

export default SellerOrderView;
