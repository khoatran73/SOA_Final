import clsx from 'clsx';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '~/assets/news/back.svg';
import acceptedIcon from '~/assets/news/delivery_accepted.svg';
import acceptedGreenIcon from '~/assets/news/delivery_accepted_green.svg';
import doneIcon from '~/assets/news/delivery_done.svg';
import doneGreenIcon from '~/assets/news/delivery_done_green.svg';
import receivedIcon from '~/assets/news/delivery_received.svg';
import shippingIcon from '~/assets/news/delivery_shipping.svg';
import shippingGreenIcon from '~/assets/news/delivery_shipping_green.svg';
import Loading from '~/component/Elements/loading/Loading';
import { VND_CHAR } from '~/configs';
import { requestApi } from '~/lib/axios';
import { HistoryOrderResponse, OrderStatus, OrderStatusToString } from '~/types/home/order';
import DateTimeUtil from '~/util/DateTimeUtil';
import LocaleUtil from '~/util/LocaleUtil';
import { GET_ORDERS_BY_HISTORY_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';

interface Props {}

const getOrdersByHistoryId = (historyId?: string) => {
    return requestApi<HistoryOrderResponse>('get', GET_ORDERS_BY_HISTORY_API + '/' + historyId);
};

const OrderHistory: React.FC<Props> = props => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: requestOrders, isLoading } = useQuery(['GET_ORDERS_BY_HISTORY_ID_' + id], () =>
        getOrdersByHistoryId(id),
    );
    const history = requestOrders?.data?.result || ({} as HistoryOrderResponse);
    const orderWaiting = history?.orders?.find(x => x.status === OrderStatus.Waiting);
    const orderConfirm = history?.orders?.find(x => x.status === OrderStatus.Confirm);
    const orderShipping = history?.orders?.find(x => x.status === OrderStatus.Shipping);
    const orderDone = history?.orders?.find(x => x.status === OrderStatus.Done);

    const genLatestOrder = () => {
        if (orderDone) return orderDone;
        if (orderShipping) return orderShipping;
        if (orderConfirm) return orderConfirm;
        return orderWaiting;
    };

    const latestStatus = genLatestOrder();

    if (isLoading) return <Loading />;
    return (
        <BoxContainer>
            <div>
                <div className="flex w-full items-center justify-between pb-3 mb-3 border-b border-[#dbdbdb]">
                    <div
                        className="flex-1 flex items-center justify-start text-md cursor-pointer uppercase"
                        onClick={() => navigate(-1)}
                    >
                        <img src={backIcon} width={14} alt="" />
                        <span>Trở lại</span>
                    </div>
                    <div className="flex-1 text-right uppercase text-md text-red-500">
                        {_.get(OrderStatusToString, latestStatus?.status ?? OrderStatus.Waiting)}
                    </div>
                </div>
                <div className="flex w-full items-center justify-between my-8">
                    {/* #7AC45A: xanh */}
                    {/* CACACA : xams */}
                    <div className="flex flex-col justify-center items-center flex-1">
                        <div className="w-14 h-14 border-2 border-green-500 flex items-center justify-center p-2 rounded-full">
                            <img width={32} height={32} src={receivedIcon} alt="" />
                        </div>
                        <span className={clsx('font-bold my-2', '')}>Tiếp nhận</span>
                        <div className="text-[13px] text-[#999] -my-1">
                            {moment(orderWaiting?.createdAt).format(DateTimeUtil.DmyHmsFormat)}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div
                            className={clsx(
                                ' w-[150px] h-[5px]',
                                //
                                !orderConfirm ? 'bg-[#e8e8e8]' : 'bg-[#7ac45a]',
                            )}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center flex-1">
                        <div
                            className={clsx(
                                'w-14 h-14 border-2 flex items-center justify-center p-2 rounded-full',
                                //
                                !orderConfirm ? 'border-[#e8e8e8]' : 'border-[#7ac45a]',
                            )}
                        >
                            <img width={24} height={24} src={!orderConfirm ? acceptedIcon : acceptedGreenIcon} alt="" />
                        </div>
                        <span className={clsx('font-bold my-2', '')}>Chốt đơn</span>
                        <div className="text-[13px] text-[#999] -my-1">
                            {orderConfirm && moment(orderConfirm?.createdAt).format(DateTimeUtil.DmyHmsFormat)}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div
                            className={clsx(
                                ' w-[150px] h-[5px]',
                                //
                                !orderShipping ? 'bg-[#e8e8e8]' : 'bg-[#7ac45a]',
                            )}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center flex-1">
                        <div
                            className={clsx(
                                'w-14 h-14 border-2 flex items-center justify-center p-2 rounded-full',
                                //
                                !orderShipping ? 'border-[#e8e8e8]' : 'border-[#7ac45a]',
                            )}
                        >
                            <img
                                width={32}
                                height={32}
                                src={!orderShipping ? shippingIcon : shippingGreenIcon}
                                alt=""
                            />
                        </div>
                        <span className={clsx('font-bold my-2', '')}>Đang giao</span>
                        <div className="text-[13px] text-[#999] -my-1">
                            {orderShipping && moment(orderShipping?.createdAt).format(DateTimeUtil.DmyHmsFormat)}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div
                            className={clsx(
                                ' w-[150px] h-[5px]',
                                //
                                !orderDone ? 'bg-[#e8e8e8]' : 'bg-[#7ac45a]',
                            )}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center flex-1">
                        <div
                            className={clsx(
                                'w-14 h-14 border-2 flex items-center justify-center p-2 rounded-full',
                                //
                                !orderDone ? 'border-[#e8e8e8]' : 'border-[#7ac45a]',
                            )}
                        >
                            <img width={32} height={32} src={!orderDone ? doneIcon : doneGreenIcon} alt="" />
                        </div>
                        <span className={clsx('font-bold my-2', '')}>Hoàn tất</span>
                        <div className="text-[13px] text-[#999] -my-1">
                            {orderDone && moment(orderDone?.createdAt).format(DateTimeUtil.DmyHmsFormat)}
                        </div>
                    </div>
                </div>
                <div
                    className="h-1 my-3"
                    style={{
                        background:
                            'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
                        // backgroundPosition: '-25px',
                    }}
                />
                <div className="w-full pb-3 mb-3">
                    <div className="text-base font-bold py-3">Địa chỉ nhận hàng</div>
                    <div className="text-[#999] ">
                        <div className="text-md text-[#222]">{history?.address?.name}</div>
                        <div className="text-xs text-[#333] mt-2">{history?.address?.phone}</div>
                        <div className="text-xs text-[#333] mt-1">
                            {history?.address?.address}, {history?.address?.wardName}, {history?.address?.districtName},{' '}
                            {history?.address?.provinceName}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex w-full justify-between pb-3 border-b-2 border-dashed border-black">
                        <span>Số tiền</span>
                        <span>
                            {LocaleUtil.toLocaleString(history?.totalVnd ?? 0)} {VND_CHAR}
                        </span>
                    </div>
                    <div className="flex w-full justify-between my-3">
                        <span>Tổng thanh toán</span>
                        <span className="text-base font-bold">
                            {LocaleUtil.toLocaleString(history?.totalVnd ?? 0)} {VND_CHAR}
                        </span>
                    </div>
                    <div className="flex w-full justify-between my-3">
                        <span>Bằng chữ</span>
                        <span className="text-base font-bold">
                            {LocaleUtil.numberToText(history?.totalVnd ?? 0)} đồng
                        </span>
                    </div>
                </div>
            </div>
        </BoxContainer>
    );
};

export default OrderHistory;
