import clsx from 'clsx';
import React from 'react';
import BoxContainer from '../layout/BoxContainer';
import HomeContainer from '../layout/HomeContainer';
import qrImage from '~/assets/footer/qr.jpeg';
import iosImage from '~/assets/footer/ios.svg';
import androidImage from '~/assets/footer/android.svg';
import facebookImage from '~/assets/footer/facebook.svg';
import youtubeImage from '~/assets/footer/youtube.svg';
import certificateImage from '~/assets/footer/certificate.png';

const HomeFooter: React.FC = () => {
    return (
        <div
            className={clsx(
                'home-footer text-sm w-full flex flex-col bg-[#f4f4f4]',
                //
            )}
        >
            <div className="w-full bg-white">
                <HomeContainer className="py-2">
                    <BoxContainer className="flex">
                        <div className="flex-1">
                            <div className="font-bold mb-3 text-sm uppercase">Tải ứng dụng</div>
                            <div className="flex">
                                <div className="">
                                    <img
                                        width={87}
                                        height={87}
                                        className="object-cover cursor-pointer"
                                        src={qrImage}
                                        alt=""
                                    />
                                </div>
                                <div className="flex flex-col justify-between ml-3">
                                    <img
                                        width={94}
                                        height={32}
                                        className="object-cover cursor-pointer mb-4"
                                        src={iosImage}
                                        alt=""
                                    />
                                    <img
                                        width={94}
                                        height={32}
                                        className="object-cover cursor-pointer mb-4"
                                        src={androidImage}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold mb-3 text-sm uppercase">Hỗ trợ khách hàng</div>
                            <div className="flex flex-col">
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">Trung tâm trợ giúp</div>
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">An toàn mua bán</div>
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">Quy định cần biết</div>
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">Quy chế quyền riêng tư</div>
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">Liên hệ hỗ trợ</div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold mb-3 text-sm uppercase">Về Chợ đồ si</div>
                            <div className="flex flex-col">
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">Giới thiệu</div>
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">Tuyển dụng</div>
                                <div className="text-[#777] text-sm mb-3 cursor-pointer">blog</div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div>
                                <div className="font-bold mb-3 text-sm uppercase">Liên kết</div>
                                <div className="flex items-center">
                                    <img
                                        width={32}
                                        height={32}
                                        className="object-cover mr-4 cursor-pointer"
                                        src={facebookImage}
                                        alt=""
                                    />
                                    <img
                                        width={32}
                                        height={32}
                                        className="object-cover mr-4 cursor-pointer"
                                        src={youtubeImage}
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="font-bold mb-3 text-sm uppercase">Chứng nhận</div>
                                <div>
                                    <img
                                        width={130}
                                        height={40}
                                        className="object-cover mb-4"
                                        src={certificateImage}
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </BoxContainer>
                </HomeContainer>
            </div>
            <div className="w-full bg-white mt-1">
                <HomeContainer className="py-2">
                    <BoxContainer>
                        <div className="text-xs text-[#8C8C8C] text-center">
                            CÔNG TY TNHH CHỢ ĐỒ SI - Người đại diện theo pháp luật: Trần&nbsp;Anh&nbsp;Khoa;
                            GPDKKD:&nbsp;0312120782&nbsp;do&nbsp;sở&nbsp;KH&nbsp;&amp;&nbsp;ĐT&nbsp;TP.HCM&nbsp;cấp&nbsp;ngày&nbsp;11/01/2013;
                            <br />
                            GPMXH: 17/GP-BTTTT do Bộ Thông tin và Truyền thông cấp&nbsp;ngày&nbsp;15/01/2019 -
                            Chịu&nbsp;trách&nbsp;nhiệm&nbsp;nội&nbsp;dung:&nbsp;Trần&nbsp;Minh&nbsp;Ngọc.&nbsp;
                            <span className="cursor-pointer text-[#1956B8] underline">
                                Chính&nbsp;sách&nbsp;sử&nbsp;dụng
                            </span>
                            <br />
                            Địa chỉ: 19 Nguyễn Hữu Thọ, Phường Tân Phong, Quận&nbsp;7, Thành phố Hồ&nbsp;Chí&nbsp;Minh,
                            Việt&nbsp;Nam;
                            Email:&nbsp;trogiup@chodosi.vn&nbsp;-&nbsp;Tổng&nbsp;đài&nbsp;CSKH:&nbsp;0865997531&nbsp;(1.000đ/phút)
                        </div>
                    </BoxContainer>
                </HomeContainer>
            </div>
        </div>
    );
};

export default HomeFooter;
