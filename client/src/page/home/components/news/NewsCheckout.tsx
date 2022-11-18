import { Avatar, Empty } from 'antd';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '~/AppStore';
import buyProtectionIcon from '~/assets/news/buy-protection.svg';
import chatIcon from '~/assets/news/chat.png';
import acceptedIcon from '~/assets/news/delivery_accepted.svg';
import doneIcon from '~/assets/news/delivery_done.svg';
import receivedIcon from '~/assets/news/delivery_received.svg';
import shippingIcon from '~/assets/news/delivery_shipping.svg';
import paypalIcon from '~/assets/news/paypal.svg';
import Loading from '~/component/Elements/loading/Loading';
import Forbidden from '~/component/Layout/Forbidden';
import { requestApi } from '~/lib/axios';
import { NewsResponse, NewsStatus } from '~/types/home/news';
import { NEWS_DETAIL_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
//orange
import deliveryIcon from '~/assets/news/delivery_orange.svg';
import forumIcon from '~/assets/news/forum.svg';
import locationIcon from '~/assets/news/location_orange.svg';
import paymentOrangeIcon from '~/assets/news/payment_orange.svg';
// normal
import stickyIcon from '~/assets/news/sticky_note.svg';

import TextArea from 'antd/lib/input/TextArea';
import clsx from 'clsx';
import { VND_CHAR } from './../../../../configs/index';
import LocaleUtil from '~/util/LocaleUtil';

const getNewsDetail = (id: string | undefined) => {
    if (!id) return;
    return requestApi<NewsResponse>('get', NEWS_DETAIL_API + '/' + id);
};

const NewsCheckout: React.FC = () => {
    const { id } = useParams();
    const { data: requestNews, isLoading } = useQuery([`GET_NEWS_DETAIL_${id}`], () => getNewsDetail(id));
    const news = requestNews?.data?.result;
    const { authUser } = useSelector((state: RootState) => state.authData);

    const isOnSell = useMemo(() => news?.status === NewsStatus.OnSell, [news?.status]);
    const isOwnNews = useMemo(() => news?.userId === authUser?.user.id, [authUser?.user.id, news?.userId]);
    const isSellOnline = useMemo(() => news?.isOnline, [news?.isOnline]);

    const renderBottomBill = () => {
        return Array.from({ length: 54 }, (_, index) => index + 1).map(num => {
            return (
                <div
                    key={num}
                    className={clsx('w-0 h-0 absolute bottom-[-6px] z-10')}
                    style={{
                        borderTop: '6px solid white',
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        left: `${(num - 1) * 12}px`,
                    }}
                />
            );
        });
    };

    if (isLoading) return <Loading />;
    if (!isOnSell || !news) return <Empty description="Xin lỗi, tin này đã ẩn hoặc không tồn tại!" />;
    if (!isSellOnline) return <Empty description="Xin lỗi, tin này chỉ bán trực tiếp!" />;
    if (!isOwnNews) return <Forbidden />;

    return (
        <BoxContainer className="bg-transparent p-0">
            <div className="w-[65%]">
                <div className="p-3 bg-white">
                    <span className="font-bold text-lg">Xác nhận đơn hàng</span>
                </div>
                <div>
                    <div className="w-full flex items-center p-3 rounded  bg-[#f1f8ee]">
                        <div className="w-8">
                            <img src={buyProtectionIcon} alt="" width={32} height={32} />
                        </div>
                        <div className="flex flex-col ml-3">
                            <div className="font-bold text-black text-sm">Thanh toán đảm bảo khi MUA NGAY</div>
                            <div className="text-black text-xs mt-0.5">Hoàn tiền 100% nếu không nhận được hàng</div>
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3 bg-white">
                    <div className="flex mt-4">
                        {/* #7AC45A: xanh */}
                        {/* CACACA : xams */}
                        <div className="flex flex-col justify-center items-center flex-1">
                            <img src={receivedIcon} alt="" />
                            <span className={clsx('font-bold my-2', '')}>Tiếp nhận</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-[#7ac45a] w-[50px] h-[2px]" />
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <img src={acceptedIcon} alt="" />
                            <span className={clsx('font-bold my-2', '')}>Chốt đơn</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-[#e8e8e8] w-[50px] h-[2px]" />
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <img src={shippingIcon} alt="" />
                            <span className={clsx('font-bold my-2', '')}>Đang giao</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="bg-[#e8e8e8] w-[50px] h-[2px]" />
                        </div>
                        <div className="flex flex-col justify-center items-center flex-1">
                            <img src={doneIcon} alt="" />
                            <span className={clsx('font-bold my-2', '')}>Hoàn tất</span>
                        </div>
                    </div>
                    <hr className="my-2" />
                    <div>
                        <div className="flex w-full justify-between items-center">
                            <div className="flex">
                                <img src={locationIcon} alt="" />
                                <div className="text-base font-bold ml-2">Địa chỉ Người nhận</div>
                            </div>
                            <div className="font-bold cursor-pointer uppercase text-[#4a90e2]">Thay đổi</div>
                        </div>
                        <div className="mt-2">
                            <div>Anh Khoa Trần | 0865997531</div>
                            <div className="text-[#777] mt-2 mb-4">123, Phường Bình Thuận, Quận Hải Châu, Đà Nẵng</div>
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3 bg-white">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center">
                            <Avatar size={24} style={{ fontSize: 10 }}>
                                A
                            </Avatar>
                            <span className="font-bold ml-2">Phương Thảo</span>
                        </div>
                        <div className="flex items-center justify-center py-1 px-2 rounded border border-[#e8e8e8] cursor-pointer">
                            <img src={chatIcon} alt="" width={24} />
                            <span className="ml-2">Chat</span>
                        </div>
                    </div>
                    <div className="flex my-2">
                        <div className="w-16 h-16">
                            <img
                                width={64}
                                height={64}
                                className="object-cover"
                                src={
                                    'https://cdn.chotot.com/3TiVQX6HrptuXXe44VFioQL_1jB2ajnPMJJupgIoyNs/preset:listing/plain/092feac01602f4fbdd2c7c8aee8ace07-2799541796690472608.jpg'
                                }
                                alt=""
                            />
                        </div>
                        <div className="ml-2">
                            <div>quần tất thỏ và cà rốt</div>
                            <div className="text-[#d0021b] font-bold">89.000 {VND_CHAR}</div>
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3 bg-white">
                    <div className="flex">
                        <img src={deliveryIcon} alt="" />
                        <div className="text-base font-bold ml-2">Phương thức Giao hàng</div>
                    </div>
                    <div className="flex items-center mt-5 mb-3">
                        <img src={forumIcon} width={32} alt="" />
                        <div className="text-md ml-2">Tự thỏa thuận phí giao hàng</div>
                    </div>
                </div>
                <div className="p-3 mb-3 bg-white">
                    <div className="flex">
                        <img src={paymentOrangeIcon} alt="" />
                        <div className="text-base font-bold ml-2">Phương thức Thanh toán</div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center mt-5 mb-3">
                            <img src={paypalIcon} width={32} alt="" />
                            <div className="text-md ml-2">Ví PayPal</div>
                        </div>
                        <div className="font-bold cursor-pointer uppercase text-[#4a90e2]">Thay đổi</div>
                    </div>
                </div>
                <div className="p-3 mb-3 bg-white pb-5 relative">
                    <div className="text-base font-bold mb-3">Thông tin Thanh toán</div>
                    <div className="flex w-full justify-between pb-3 border-b-2 border-dashed border-black">
                        <span>Số tiền</span>
                        <span>5.750.000 {VND_CHAR}</span>
                    </div>
                    <div className="flex w-full justify-between my-3">
                        <span>Tổng thanh toán</span>
                        <span className="text-base font-bold">5.750.000 {VND_CHAR}</span>
                    </div>
                    <div className="flex w-full justify-between my-3">
                        <span>Bằng chữ</span>
                        <span className="text-base font-bold">{LocaleUtil.numberToText(5750000)} đồng</span>
                    </div>
                    <div className="flex mt-5 mb-2">
                        <img src={stickyIcon} alt="" />
                        <div className="text-base font-bold ml-2">Ghi chú</div>
                    </div>
                    <TextArea placeholder="Nhập ghi chú cho người bán" rows={3} />
                    {renderBottomBill()}
                </div>
                <div className="p-3 mb-3 bg-white">
                    <div className="">
                        Bằng việc bấm <b>Đặt hàng</b>, bạn đã đọc, hiểu rõ và đồng ý với{' '}
                        <Link to="" className="text-[#4a90e2] hover:text-[#4a90e2] hover:underline">
                            Chính sách mua hàng
                        </Link>{' '}
                        của Chợ Đồ Si.
                    </div>
                    <div className="mt-7 mb-2 flex justify-between">
                        <div className="flex flex-col">
                            <div className="uppercase text-[#9b9b9b] text-[10px] font-bold">TỔNG CỘNG:</div>
                            <div className="font-bold text-lg text-black">5.750.000đ</div>
                        </div>
                        <div
                            className={clsx(
                                'w-[400px] h-10 flex items-center justify-center',
                                'rounded text-white bg-[#fe9900] uppercase font-bold',
                            )}
                        >
                            Đặt hàng
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-[35%]" />
        </BoxContainer>
    );
};

export default NewsCheckout;
