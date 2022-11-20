import { faChartColumn, faEyeSlash, faShop } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import React from 'react';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import cameraImage from '~/assets/news/camera.svg';
import { VND_CHAR } from '~/configs';
import LocaleUtil from '~/util/LocaleUtil';
import { Link, useNavigate } from 'react-router-dom';
import { OrderResponse, OrderStatusToString } from '~/types/home/order';
import _ from 'lodash';

interface Props {
    item: OrderResponse;
}

const OrderItem: React.FC<Props> = props => {
    const { item } = props;
    const navigate = useNavigate();
    return (
        <div className="bg-white mb-3 p-3">
            <div className="w-full flex items-center justify-between border-b border-[#dbdbdb] mb-3 pb-3">
                <div className="flex-1 flex items-center">
                    <span className="font-bold text-md">{item.receiverUser.fullName}</span>
                    <div
                        className="ml-2 text-xs p-1 rounded border border-[#dbdbdb] text-[#555] cursor-pointer"
                        onClick={() => navigate(`/user/info/${item.receiverUser.id}`)}
                    >
                        <BaseIcon icon={faShop} size="xs" />
                        <span className="ml-1">View Shop</span>
                    </div>
                </div>
                <div className="flex-1 text-right uppercase text-md text-red-500">
                    {_.get(OrderStatusToString, item.status)}
                </div>
            </div>
            <Link
                to={`/order/history/${item.historyId}`}
                className="w-full flex items-center justify-between border-b border-[#dbdbdb] mb-3 pb-3"
            >
                <div className="flex">
                    <div className="relative overflow-hidden w-[110px] min-w[110px] h-[71px] rounded">
                        <img
                            src={item.history?.newsUrl}
                            alt=""
                            width={110}
                            height={70}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex min-w-0 ml-2.5 justify-between flex-1 w-full h-[75px]">
                        <div className="w-full h-full ">
                            <div className="flex">
                                <div className="text-[#1e1e1e] hover:text-[#1e1e1e] pr-2.5 whitespace-nowrap overflow-hidden block text-[15px]">
                                    {item.history.title}
                                </div>
                            </div>
                            <div className="flex flex-wrap h-full">
                                <div className="float-left w-[40%] relative ">
                                    <div className="block text-[#d0011b] text-[15px] mt-[5px] ">
                                        <span>
                                            <b>
                                                {LocaleUtil.toLocaleString(item.history.totalVnd ?? 0)}{' '}
                                                {VND_CHAR}
                                            </b>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div>
                <div className="flex w-full justify-between pb-3 border-b-2 border-dashed border-black">
                    <span>Số tiền</span>
                    <span>
                        {LocaleUtil.toLocaleString(item.history.totalVnd ?? 0)} {VND_CHAR}
                    </span>
                </div>
                <div className="flex w-full justify-between my-3">
                    <span>Tổng thanh toán</span>
                    <span className="text-base font-bold">
                        {LocaleUtil.toLocaleString(item.history.totalVnd ?? 0)} {VND_CHAR}
                    </span>
                </div>
                <div className="flex w-full justify-between my-3">
                    <span>Bằng chữ</span>
                    <span className="text-base font-bold">
                        {LocaleUtil.numberToText(item.history.totalVnd ?? 0)} đồng
                    </span>
                </div>
                <div className="w-full flex justify-between border border-[#f4f4f4]">
                    <div
                        className={clsx(
                            'text-[#38699f] text-[15px] flex-1 py-2 border-r border-[#f4f4f4]',
                            'flex items-center justify-center cursor-pointer',
                        )}
                        // onClick={handleHideNews}
                    >
                        <div className=" select-none">Đợi xử lý</div>
                    </div>
                    <div
                        className={clsx(
                            'text-[#38699f] text-[15px] flex-1 py-2 border-l border-[#f4f4f4]',
                            'flex items-center justify-center cursor-pointer',
                        )}
                        // onClick={handleStatistic}
                    >
                        <div className="select-none">Liên hệ người bán</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
