import { faChartColumn, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Tabs } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '~/AppStore';
import cameraImage from '~/assets/news/camera.svg';
import sellIcon from '~/assets/news/ic-sell-faster.svg';
import pageIndicatorImage from '~/assets/news/page-indicator.svg';
import pageNumberTooltipImage from '~/assets/news/page-number-tooltip.svg';
import coinIcon from '~/assets/news/coin.svg';
import pageSliderImage from '~/assets/news/page-slider.svg';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { VND_CHAR } from '~/configs';
import { requestApi } from '~/lib/axios';
import { NewsResponse, NewsStatus } from '~/types/home/news';
import DateTimeUtil from '~/util/DateTimeUtil';
import { NEWS_BY_USER_ID_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import LocaleUtil from '~/util/LocaleUtil';

const getNewsByUserId = (userId?: string) => {
    return requestApi<NewsResponse[]>('get', NEWS_BY_USER_ID_API, {}, { params: { userId } });
};

const NewsItem = ({ news }: { news: NewsResponse }) => {
    return (
        <div className="mb-2 px-3 py-2 z-10 bg-white relative rounded-[1px]" style={{ height: '100%' }}>
            <div className="flex">
                <div className="relative overflow-hidden cursor-pointer w-[110px] min-w[110px] h-[71px] rounded">
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
                <div className="flex min-w-0 ml-2.5 justify-between cursor-pointer flex-1 w-full h-[75px]">
                    <div className="w-full h-full ">
                        <div className="flex">
                            <Link
                                to={`/news/detail/${news.id}`}
                                className="text-[#1e1e1e] hover:text-[#1e1e1e] pr-2.5 whitespace-nowrap overflow-hidden block text-[15px]"
                            >
                                {news.title}
                            </Link>
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
                                        {moment(news.createdAt).format(DateTimeUtil.HmsDmyFormat)}
                                    </span>
                                </div>
                            </div>
                            <div className="relative float-left w-[60%] h-[87%]">
                                <div className="bg-white absolute bottom-[30%] right-[53%] py-0 px-2.5 text-center">
                                    <div className="relative h-[26px] ">
                                        <div
                                            className="w-[68px] h-[29px] text-[11px] rounded relative duration-500 ease-in-out"
                                            style={{
                                                left: `${148 * Number(news.page) / 100}%`,
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
                                                left: `${148 * Number(news.page) / 100}%`,
                                                color: 'rgb(202, 206, 1)',
                                                backgroundPosition: '50%',
                                                backgroundSize: '18px 18px',
                                                backgroundRepeat: 'no-repeat',
                                                background: `url(${pageIndicatorImage})`,
                                            }}
                                        />
                                    </div>
                                    <div
                                        className={`h-[5px] w-[${148}px] mt-[15px]`}
                                        style={{
                                            backgroundRepeat: 'no-repeat',
                                            background: `url(${pageSliderImage})`,
                                        }}
                                    />
                                </div>
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
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-between mt-4 border border-[#f4f4f4]">
                <div
                    className={clsx(
                        'text-[#38699f] text-[15px] flex-1 py-2 border-r border-[#f4f4f4]',
                        'flex items-center justify-center',
                    )}
                >
                    <div className="cursor-pointer select-none">
                        <BaseIcon icon={faEyeSlash} className="mr-1" size="sm" />
                        Đã bán / Ẩn tin
                    </div>
                </div>
                <div
                    className={clsx(
                        'text-[#38699f] text-[15px] flex-1 py-2 border-l border-[#f4f4f4]',
                        'flex items-center justify-center',
                    )}
                >
                    <div className="cursor-pointer select-none">
                        <BaseIcon icon={faChartColumn} className="mr-1" size="sm" />
                        Xem thống kê
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsDashboard: React.FC = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const { data: requestNews, isLoading } = useQuery(['GET_NEWS_DETAIL_BY_USER_ID'], () =>
        getNewsByUserId(authUser?.user.id),
    );
    const listNews = requestNews?.data?.result ?? [];
    const listNewsOnSell = listNews.filter(x => x.status === NewsStatus.OnSell);
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
                                    <Avatar size={80}>B</Avatar>
                                </Link>
                            </div>
                            <div className=" float-left" style={{ width: 'calc(100% - 270px)' }}>
                                <div className="text-lg my-2 mx-auto font-bold mt-18 py-[5px]">
                                    <Link to={''} className="text-[#1e1e1e] hover:text-[#1e1e1e]">
                                        <span>Anh Khoa Trần</span>
                                    </Link>
                                </div>
                                <span>
                                    <Link
                                        to={''}
                                        className="text-sm text-[#2d65a0] hover:text-[#2d65a0] font-medium border border-[#2d65a0] rounded py-2 px-2.5"
                                    >
                                        Trang cá nhân
                                    </Link>
                                </span>
                                &nbsp;&nbsp;
                                <span>
                                    <Link
                                        to={''}
                                        className="text-sm text-[#2d65a0] hover:text-[#2d65a0] font-medium border border-[#2d65a0] rounded py-2 px-2.5"
                                    >
                                        Liên kết ví bán hàng
                                    </Link>
                                </span>
                            </div>
                        </div>
                        <div className="w-full text-[13px]">
                            <Tabs defaultActiveKey="1" className="">
                                <Tabs.TabPane tab={`Đang hiển thị (${listNewsOnSell.length})`} key="1">
                                    {listNewsOnSell.map(news => {
                                        return (
                                            <div key={news.id}>
                                                <NewsItem news={news} />
                                            </div>
                                        );
                                    })}
                                </Tabs.TabPane>
                                <Tabs.TabPane tab={`Đã bán/ Đã ẩn (${listNewsSold.length})`} key="2">
                                    {listNewsSold.map(news => {
                                        if (news.status !== NewsStatus.Sold) return null;
                                        return (
                                            <div key={news.id}>
                                                <NewsItem news={news} />
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
                                <p>Tài khoản Đồng Tốt</p>
                                <span className="text-lg">0</span>
                            </div>
                        </div>
                        <div className="w-full float-left relative bg-[#dfdfdf]">
                            <span className="block text-center py-[5px]">Các gói nạp</span>
                        </div>
                        <div className="">
                            <ul className="_1902iE8tRDmhuAmwmwcuOe">
                                <li>
                                    <i>109198</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 8.000.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>109197</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 3.000.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>40</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 1.500.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>39</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 1.000.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>38</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 500.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>37</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 100.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>36</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 50.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                                <li>
                                    <i>81</i>
                                    <label>
                                        <span className="xgL91COrexpdYDS0TGkqB">Nạp 20.000</span>
                                        <small className="_1mIdCFAzYjbxUJJsJjTXrs" />
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full">
                            <a
                                href="/dashboard/balances"
                                className={clsx(
                                    'm-auto w-full h-[30px] text-white bg-[#5a9e3f] uppercase',
                                    'text-[13px] font-bold flex items-center justify-center rounded',
                                )}
                            >
                                Nạp Ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </BoxContainer>
    );
};

export default NewsDashboard;
