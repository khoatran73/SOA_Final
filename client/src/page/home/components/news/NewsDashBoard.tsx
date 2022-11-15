import { faChartBar, faChartColumn, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Tabs } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';

const NewsDashboard: React.FC = () => {
    return (
        <BoxContainer className="p-0 bg-transparent">
            <div className="before:table after:clear-both after:table">
                <div className="w-full float-left relative">
                    <div className="before:table after:clear-both after:table flex">
                        <div className="relative w-3/4 p-3 col-md-3 bg-white mr-2 pb-0">
                            <div className="before:table after:clear-both after:table">
                                <HomeBreadCrumb
                                    className="-mx-3 -my-1 py-1"
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
                                    <div className="before:table after:clear-both after:table">
                                        <h1 className="flex items-center justify-between py-[10px] px-3 -mx-3 font-bold mt-0 mb-0 text-base border-b border-[#dbdbdb]">
                                            Quản lý tin đăng
                                        </h1>
                                    </div>
                                    <div className="w-full flex pb-2.5 -mx-3 px-3 mt-[15px] border-b border-[#dbdbdb]">
                                        <div className="w-[80px] h-[80px] rounded-[40px] overflow-hidden mr-[15px] float-left">
                                            <a href="https://www.chotot.com/user/25229a99cf6d6491a505b35cee387c8d">
                                                <img src="https://cdn.chotot.com/uac2/24003925" />
                                            </a>
                                        </div>
                                        <div className=" float-left" style={{ width: 'calc(100% - 270px)' }}>
                                            <div className="text-lg my-2 mx-auto font-bold mt-18 py-[5px]">
                                                <a href="https://www.chotot.com/user/25229a99cf6d6491a505b35cee387c8d">
                                                    <span>Anh Khoa Trần</span>
                                                </a>
                                            </div>
                                            <span>
                                                <a
                                                    href="https://www.chotot.com/user/25229a99cf6d6491a505b35cee387c8d"
                                                    className="text-sm text-[#2d65a0] font-medium border border-[#2d65a0] rounded py-2 px-2.5"
                                                >
                                                    Trang cá nhân
                                                </a>
                                            </span>
                                            &nbsp;&nbsp;
                                            <span>
                                                <a
                                                    href="https://www.chotot.com/profile/payout"
                                                    className="text-sm text-[#2d65a0] font-medium border border-[#2d65a0] rounded py-2 px-2.5"
                                                >
                                                    Liên kết ví bán hàng&nbsp;<span>Mới</span>
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto overflow-y-hidden w-full text-[13px mb-0 pl-0 list-none">
                                        <Tabs defaultActiveKey="1">
                                            <Tabs.TabPane tab="Tab 1" key="1">
                                                <div className="my-0 mx-auto bg-[#f4f4f4]">
                                                    <div className="mb-2.5 relative z-10" style={{ height: '100%' }}>
                                                        <div className="bg-white relative rounded-[1px] pt-2.5">
                                                            <div className="flex">
                                                                <div className="relative overflow-hidden cursor-pointer w-[102px] min-w[102px] h-[71px] rounded">
                                                                    <img
                                                                        src="https://cdn.chotot.com/49wTzr3YqVXeNWW-kuIjSnLSPQ6ksQrTH7LJHU9SEYg/preset:listing/plain/501826f2a855c31732472d5eaed447fb-2796999207917424547.jpg"
                                                                        alt=" "
                                                                        className="lazy"
                                                                    />
                                                                    <div className="block absolute right-[5px] top-[5px] w-[26px] h-[20px] text-white text-[12px] font-bold bg-[url('https://static.chotot.com/storage/react-common/camera.svg')]">
                                                                        2
                                                                    </div>
                                                                </div>
                                                                <div className="flex min-w-0 ml-2.5 justify-between cursor-pointer flex-1">
                                                                    <div className="w-full h-[75px]">
                                                                        <div className="w-full h-full ">
                                                                            <div className="flex">
                                                                                <a
                                                                                    className="text-black pr-2.5 whitespace-nowrap overflow-hidden block text-[15px]"
                                                                                    href="https://www.chotot.com/101044179.htm"
                                                                                >
                                                                                    Tôi muốn bán bánh kẹo
                                                                                </a>
                                                                            </div>
                                                                            <div className="flex flex-wrap h-full">
                                                                                <div className="float-left w-[40%] relative ">
                                                                                    <div className="block text-[#d0011b] text-[15px] mt-[5px] ">
                                                                                        <span>
                                                                                            <b>230.002 đ</b>
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex h-[25px] text-[13px] text-black justify-between">
                                                                                        <span className="text-black text-[13px] opacity-70 self-end">
                                                                                            20:13 13/11/22
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="relative float-left w-[60%] h-[87%]">
                                                                                    <div className="bg-white absolute bottom-[30%] right-[53%]">
                                                                                        <div className="py-0 px-2.5 text-center">
                                                                                            <div className="relative h-[26px] ">
                                                                                                <div
                                                                                                    className="w-[68px] h-[29px] text-[11px] rounded relative duration-500 ease-in-out bg-[url('https://static.chotot.com/storage/chotot-icons-me/page-number-tooltip.svg')]"
                                                                                                    style={{
                                                                                                        left: '11%',
                                                                                                        color: 'rgb(202, 206, 1)',
                                                                                                        backgroundPosition:
                                                                                                            '50%',
                                                                                                        backgroundSize:
                                                                                                            '68px 29px',
                                                                                                        backgroundRepeat:
                                                                                                            'no-repeat',
                                                                                                    }}
                                                                                                >
                                                                                                    <span className="relative top-[3px]">
                                                                                                        Trang 12
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="w-[18px] h-[18px] bg-[url('https://static.chotot.com/storage/chotot-icons-me/page-indicator.svg')] absolute bottom-[-26px] duration-500 ease-in-out"
                                                                                                    style={{
                                                                                                        left: '11%',
                                                                                                        color: 'rgb(202, 206, 1)',
                                                                                                        backgroundPosition:
                                                                                                            '50%',
                                                                                                        backgroundSize:
                                                                                                            '18px 18px',
                                                                                                        backgroundRepeat:
                                                                                                            'no-repeat',
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                            <div
                                                                                                className="h-[5px] w-[148px] mt-[15px] bg-[url('https://static.chotot.com/storage/react-common/slider_adstats.svg')]"
                                                                                                style={{
                                                                                                    backgroundSize:
                                                                                                        '148px 4px',
                                                                                                    backgroundRepeat:
                                                                                                        'no-repeat',
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="absolute w-1/2 bottom-[22%] right-0 flex self-end justify-between flex-col">
                                                                                        <a
                                                                                            className={clsx(
                                                                                                'border border-[#589f39] text-[#589f39] bg-[rgba(117,189,79,.1)]',
                                                                                                ' h-8 text-[15px] w-[146px] p-1 flex items-center',
                                                                                            )}
                                                                                        >
                                                                                            <img
                                                                                                className="mr-2"
                                                                                                src="https://static.chotot.com/storage/chotot-icons-me/ic-sell-faster.svg"
                                                                                            />
                                                                                            Bán nhanh hơn
                                                                                        </a>
                                                                                    </div>
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
                                                                        <BaseIcon
                                                                            icon={faEyeSlash}
                                                                            className="mr-1"
                                                                            size="sm"
                                                                        />
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
                                                                        <BaseIcon
                                                                            icon={faChartColumn}
                                                                            className="mr-1"
                                                                            size="sm"
                                                                        />
                                                                        Xem thống kê
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div />
                                                    </div>
                                                </div>
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Tab 2" key="2">
                                                Content of Tab Pane 2
                                            </Tabs.TabPane>
                                            <Tabs.TabPane tab="Tab 3" key="3">
                                                Content of Tab Pane 3
                                            </Tabs.TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block relative w-1/4 col-md-3 ml-2">
                            <div className="before:table after:clear-both after:table bg-white rounded p-3">
                                <div className="w-full float-left relative p-2.5 h-[85px] flex">
                                    <div className="_2ZIVS1lDi3cofxmi0NnPnf">
                                        <img
                                            src="https://static.chotot.com/storage/CT_WEB_UNI_PRIVATE_DASHBOARD/eb3a154e7fe4387f7e68296d4f8936a3df108bef/dist/fd0b58f741408a3c2032a16bdae00240.svg"
                                            alt=" "
                                            width="55"
                                            height="55"
                                        />
                                    </div>
                                    <div className="text-[12px] font-semibold w-[calc(100% - 60px)] text-left float-right mt-2.5 ml-2.5">
                                        <p>Tài khoản Đồng Tốt</p>
                                        <span className="text-lg">0</span>
                                    </div>
                                </div>
                                <div className="w-full float-left relative bg-[#dfdfdf]">
                                    <span className="block text-center py-[5px]">Các gói nạp</span>
                                </div>
                                <div className="_3l3UCYzVGoYXZyA2VlLlTv">
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
                                <div className="w-full float-left relative">
                                    <a
                                        href="/dashboard/balances"
                                        className={clsx(
                                            'm-auto w-full h-[30px] t   ext-center text-white bg-[#5a9e3f] uppercase',
                                            'text-[13px] mb-2.5 font-bold flex items-center justify-center rounded',
                                        )}
                                    >
                                        Nạp Ngay
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BoxContainer>
    );
};

export default NewsDashboard;
