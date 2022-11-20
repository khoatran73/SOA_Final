import { Empty, Tabs } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import Loading from '~/component/Elements/loading/Loading';
import { requestApi } from '~/lib/axios';
import { OrderAction, OrderResponse, OrderStatus } from '~/types/home/order';
import { GET_ORDERS_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import OrderItem from './OrderItem';

const getOrders = () => {
    return requestApi<OrderResponse[]>('get', GET_ORDERS_API, {}, { params: { action: OrderAction.Buy } });
};

const BuyerOrderView: React.FC = () => {
    // const [reSend, setReSend] = useState<boolean>(false);
    const { data: requestOrders, isLoading } = useQuery(['GET_ORDERS'], getOrders);
    const orders = requestOrders?.data.result ?? [];
    const ordersWaiting = orders.filter(x => x.status === OrderStatus.Waiting);
    const ordersConfirm = orders.filter(x => x.status === OrderStatus.Confirm);
    const ordersShipping = orders.filter(x => x.status === OrderStatus.Shipping);
    const ordersDone = orders.filter(x => x.status === OrderStatus.Done);

    if (isLoading) return <Loading />;
    return (
        <BoxContainer className="p-0 bg-transparent dashboard">
            <div className="w-full text-[13px]">
                <Tabs defaultActiveKey="1" className="">
                    <Tabs.TabPane className="min-h-[200px]" tab={'Chờ xác nhận'} key="1">
                        {ordersWaiting.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersWaiting.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane className="min-h-[200px]" tab={'Chốt đơn'} key="2">
                        {ordersConfirm.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersConfirm.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane className="min-h-[200px]" tab={'Đang giao'} key="3">
                        {ordersShipping.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersShipping.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane className="min-h-[200px]" tab={'Đã giao'} key="4">
                        {ordersDone.length === 0 ? (
                            <Empty description="Không có dữ liệu" />
                        ) : (
                            ordersDone.map(item => {
                                return (
                                    <div key={item.id}>
                                        <OrderItem item={item} />
                                    </div>
                                );
                            })
                        )}
                    </Tabs.TabPane>
                    <Tabs.TabPane className="min-h-[200px]" tab={'Hoàn tiền/ Đã hủy'} key="5">
                        {/* <NewsChartContainer /> */}
                        hoan tien, da huy
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </BoxContainer>
    );
};

export default BuyerOrderView;
