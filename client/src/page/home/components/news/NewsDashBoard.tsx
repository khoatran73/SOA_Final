import { faChartColumn, faEyeSlash, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Tabs, Tooltip } from 'antd';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '~/AppStore';
import cameraImage from '~/assets/news/camera.svg';
import coinIcon from '~/assets/news/coin.svg';
import sellIcon from '~/assets/news/ic-sell-faster.svg';
import pageIndicatorImage from '~/assets/news/page-indicator.svg';
import pageNumberTooltipImage from '~/assets/news/page-number-tooltip.svg';
import pageSliderImage from '~/assets/news/page-slider.svg';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { VND_CHAR } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { NewsSearch, NewsStatus } from '~/types/home/news';
import DateTimeUtil from '~/util/DateTimeUtil';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';
import { NEWS_BY_USER_ID_API, NEWS_HIDE_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';

const isOnSell = (status?: NewsStatus) => status === NewsStatus.OnSell;

const getNewsByUserId = (userId?: string) => {
    return requestApi<NewsSearch[]>('get', NEWS_BY_USER_ID_API, {}, { params: { userId } });
};

const StatisticNews = ({ news }: { news: NewsSearch }) => {
    return (
        <div className="-mx-[14px] -my-1">
            <div className="text-[15px] font-bold text-[#222] mb-2">
                Vị trí tin đăng{' '}
                <Tooltip title="Cho biết tin đăng của bạn đang nằm ở trang nào của khu vực và chuyên mục đang hiển thị">
                    <BaseIcon icon={faQuestionCircle} />
                </Tooltip>
            </div>
            <div>
                <div>
                    <div className="w-full">
                        <div
                            className="w-[100px] h-[45px] text-[11px] rounded relative duration-500 ease-in-out flex justify-center"
                            style={{
                                left: `${((440 - 35) * Number(news.page)) / 100}px`,
                                background: `url(${pageNumberTooltipImage})`,
                                color: 'rgb(202, 206, 1)',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                            }}
                        >
                            <span className="relative top-[9px]">Trang {news.page}</span>
                        </div>
                    </div>
                    <div className="w-full">
                        <img src={pageSliderImage} width={'100%'} height={16} />
                    </div>
                    <div className="w-full flex justify-between items-center mt-1.5">
                        <div className="flex-1 flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#589f39]" />
                            <span className="text-[9px] text-[#333] ml-1.5">Trang đầu</span>
                        </div>
                        <div className="flex-1 justify-self-end flex justify-end">
                            <span className="text-[9px] text-[#333] mr-1.5">Trang cuối</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-[#d0021b]" />
                        </div>
                    </div>
                </div>
                <div className="mt-2 ">
                    <div className="text-xs text-[#333]">
                        Tin <b>{news.title}</b> đang xuất hiện ở <b>vị trí thứ {news.index}</b> <b>trang {news.page}</b>
                        , trong mục <b>{news.categoryName}</b>
                    </div>
                    <Link
                        to={`/category?categorySlug=${news.slug}&page=${news.page}`}
                        className="text-[#38699f] text-xs italic hover:text-[#38699f] hover:underline relative -top-0.5"
                    >
                        Chi tiết
                    </Link>
                </div>
                {!DateTimeUtil.checkExpirationDate(news.bumpPriority?.toDate) && (
                    <div className="bg-[#f4f4f4] text-xs flex px-3 py-1.5 rounded mt-2 justify-between items-center">
                        <div>Đẩy tin ngay để tin lên trang đầu và bán nhanh hơn</div>
                        <Link
                            to={`/news/day-tin/${news.id}`}
                            className="px-6 py-1.5 rounded text-green-2 border border-green-2 bg-green-4 hover:text-green-2"
                        >
                            Đẩy tin
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

type NewsItemProps = {
    news: NewsSearch;
    modalRef: React.RefObject<ModalRef>;
    setReSend: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewsItem = (props: NewsItemProps) => {
    const { news, modalRef, setReSend } = props;
    const navigate = useNavigate();
    const handleShowDetail = () => {
        if (!isOnSell(news.status)) {
            NotifyUtil.warn(NotificationConstant.TITLE, 'Tin này đã ẩn!');
            return;
        }

        navigate(`/news/detail/${news.id}`);
    };

    const handleHideNews = async () => {
        const resultConfirm = await NotifyUtil.confirmDialog(
            `Ẩn tin ${news.title}`,
            'Khi bạn đã bán được hàng, hoặc không muốn tin xuất hiện trên Chợ đồ si, hãy chọn "Ẩn tin".',
        );

        if (!resultConfirm.isConfirmed) return;

        const response = await requestApi('put', NEWS_HIDE_API + '/' + news.id);
        if (response.data.success) {
            setReSend(prev => !prev);
            NotifyUtil.success(NotificationConstant.TITLE, 'Ẩn tin thành công!');
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);

        return;
    };

    const handleStatistic = () => {
        modalRef.current?.onOpen(<StatisticNews news={news} />, 'Thống kê tin đăng', '30%', faChartColumn);
    };
    return (
        <div className="mb-2 px-3 py-2 z-10 bg-white relative rounded-[1px]" style={{ height: '100%' }}>
            <div className="flex mb-4">
                <div className="relative overflow-hidden w-[110px] min-w[110px] h-[71px] rounded">
                    <img src={news.imageUrls[0]} alt="" width={110} height={70} className="object-contain" />
                    <div
                        className={clsx(
                            'absolute w-6 h-5 flex items-center justify-center text-white ',
                            'font-bold text-[10px] top-1 left-1',
                        )}
                        style={{ backgroundImage: `url(${cameraImage})` }}
                    >
                        {news?.imageUrls.length}
                    </div>
                </div>
                <div className="flex min-w-0 ml-2.5 justify-between flex-1 w-full h-[75px]">
                    <div className="w-full h-full ">
                        <div className="flex">
                            <div
                                onClick={handleShowDetail}
                                className="text-[#1e1e1e] hover:text-[#1e1e1e] cursor-pointer pr-2.5 whitespace-nowrap overflow-hidden block text-[15px]"
                            >
                                {news.title}
                            </div>
                        </div>
                        <div className="flex flex-wrap h-full">
                            <div className="float-left w-[40%] relative ">
                                <div className="block text-[#d0011b] text-[15px] mt-[5px] ">
                                    <span>
                                        <b>
                                            {LocaleUtil.toLocaleString(news.price)} {VND_CHAR}
                                        </b>
                                    </span>
                                </div>
                                <div className="flex h-[25px] text-[13px] text-black justify-between">
                                    <span className="text-black text-[13px] opacity-70 self-end">
                                        {DateTimeUtil.fromNow(news.createdAt)}
                                    </span>
                                </div>
                            </div>
                            {isOnSell(news.status) && !DateTimeUtil.checkExpirationDate(news.bumpPriority?.toDate) && (
                                <div className="relative float-left w-[60%] h-[87%]">
                                    <Link
                                        to={`/category?categorySlug=${news.slug}&page=${news.page}`}
                                        className="bg-white absolute bottom-[30%] right-[53%] py-0 px-2.5 text-center"
                                    >
                                        <div className="relative h-[26px] ">
                                            <div
                                                className="w-[68px] h-[29px] text-[11px] rounded relative duration-500 ease-in-out"
                                                style={{
                                                    left: `${((148 - 18) * Number(news.page)) / 100}px`,
                                                    color: 'rgb(202, 206, 1)',
                                                    backgroundPosition: '50%',
                                                    backgroundSize: '68px 29px',
                                                    backgroundRepeat: 'no-repeat',
                                                    background: `url(${pageNumberTooltipImage})`,
                                                }}
                                            >
                                                <span className="relative top-[3px]">Trang {news.page}</span>
                                            </div>
                                            <div
                                                className="w-[18px] h-[18px] absolute bottom-[-26px] duration-500 ease-in-out"
                                                style={{
                                                    left: `${((148 - 18) * Number(news.page)) / 100}px`,
                                                    color: 'rgb(202, 206, 1)',
                                                    backgroundPosition: '50%',
                                                    backgroundSize: '18px 18px',
                                                    backgroundRepeat: 'no-repeat',
                                                    background: `url(${pageIndicatorImage})`,
                                                }}
                                            />
                                        </div>
                                        <div
                                            className={`h-[4px] w-[${148}px] mt-[15px]`}
                                            style={{
                                                backgroundRepeat: 'no-repeat',
                                                background: `url(${pageSliderImage})`,
                                            }}
                                        />
                                    </Link>
                                    <div className="absolute w-1/2 bottom-[22%] right-0 flex self-end justify-between flex-col">
                                        <Link
                                            to={`/news/day-tin/${news.id}`}
                                            className={clsx(
                                                'border border-[#589f39] text-[#589f39] hover:text-[#589f39] bg-[rgba(117,189,79,.1)]',
                                                ' h-8 text-[15px] w-[146px] p-1 flex items-center',
                                            )}
                                        >
                                            <img className="mr-2" src={sellIcon} />
                                            Bán nhanh hơn
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isOnSell(news.status) && (
                <div className="w-full flex justify-between border border-[#f4f4f4]">
                    <div
                        className={clsx(
                            'text-[#38699f] text-[15px] flex-1 py-2 border-r border-[#f4f4f4]',
                            'flex items-center justify-center cursor-pointer',
                        )}
                        onClick={handleHideNews}
                    >
                        <div className=" select-none">
                            <BaseIcon icon={faEyeSlash} className="mr-1" size="sm" />
                            Đã bán / Ẩn tin
                        </div>
                    </div>
                    <div
                        className={clsx(
                            'text-[#38699f] text-[15px] flex-1 py-2 border-l border-[#f4f4f4]',
                            'flex items-center justify-center cursor-pointer',
                        )}
                        onClick={handleStatistic}
                    >
                        <div className="select-none">
                            <BaseIcon icon={faChartColumn} className="mr-1" size="sm" />
                            Xem thống kê
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const NewsDashboard: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const [reSend, setReSend] = useState<boolean>(false);
    const { data: requestNews, isLoading } = useQuery(['GET_NEWS_DETAIL_BY_USER_ID', reSend], () =>
        getNewsByUserId(authUser?.user.id),
    );
    const listNews = requestNews?.data?.result ?? [];
    const listNewsOnSell = listNews.filter(x => x.status === NewsStatus.OnSell);
    console.log('🚀 ~ file: NewsDashBoard.tsx ~ line 280 ~ listNewsOnSell', listNewsOnSell);
    const listNewsSold = listNews.filter(x => x.status === NewsStatus.Sold);

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
                                title: 'Quản lý tin',
                                link: '/news/dashboard',
                            },
                        ]}
                    />
                    <div className="w-full float-left relative">
                        <h1 className="flex items-center bg-white py-2 px-3 justify-between font-bold text-base border-b border-[#dbdbdb]">
                            Quản lý tin đăng
                        </h1>
                        <div className="w-full flex py-2 px-3 border-b border-[#dbdbdb] bg-white">
                            <div className="w-[80px] h-[80px] rounded-[40px] overflow-hidden mr-[15px] float-left">
                                <Link to={''}>
                                    <Avatar size={80} src={authUser?.user?.avatar} />
                                </Link>
                            </div>
                            <div className=" float-left" style={{ width: 'calc(100% - 270px)' }}>
                                <div className="text-lg my-2 mx-auto font-bold mt-18 py-[5px]">
                                    <Link to={''} className="text-[#1e1e1e] hover:text-[#1e1e1e]">
                                        <span>{authUser?.user?.fullName}</span>
                                    </Link>
                                </div>
                                <span>
                                    <Link
                                        to={`/user/info/${authUser?.user?.id}`}
                                        className="text-sm text-[#2d65a0] hover:text-[#2d65a0] font-medium border border-[#2d65a0] rounded py-2 px-2.5"
                                    >
                                        Trang cá nhân
                                    </Link>
                                </span>
                                {/* &nbsp;&nbsp;
                                <span>
                                    <Link
                                        to={''}
                                        className="text-sm text-[#2d65a0] hover:text-[#2d65a0] font-medium border border-[#2d65a0] rounded py-2 px-2.5"
                                    >
                                        Liên kết ví bán hàng
                                    </Link>
                                </span> */}
                            </div>
                        </div>
                        <div className="w-full text-[13px]">
                            <Tabs defaultActiveKey="1" className="">
                                <Tabs.TabPane tab={`Đang hiển thị (${listNewsOnSell.length})`} key="1">
                                    {listNewsOnSell.map(news => {
                                        return (
                                            <div key={news.id}>
                                                <NewsItem news={news} modalRef={modalRef} setReSend={setReSend} />
                                            </div>
                                        );
                                    })}
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={`Đã bán/ Đã ẩn (${listNewsSold.length})`} key="2">
                                    {listNewsSold.map(news => {
                                        if (news.status !== NewsStatus.Sold) return null;
                                        return (
                                            <div key={news.id}>
                                                <NewsItem news={news} modalRef={modalRef} setReSend={setReSend} />
                                            </div>
                                        );
                                    })}
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
                                    'm-auto w-full h-[30px] text-white bg-[#5a9e3f] uppercase',
                                    'text-[13px] font-bold flex items-center justify-center rounded',
                                    'hover:text-white',
                                )}
                            >
                                Nạp Ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ModalBase ref={modalRef} />
        </BoxContainer>
    );
};

export default NewsDashboard;
