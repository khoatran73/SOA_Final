import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Empty, Image } from 'antd';
import clsx from 'clsx';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '~/AppStore';
import emptyImage from '~/assets/layout/empty.jpg';
import backIcon from '~/assets/news/back.svg';
import buyProtectionIcon from '~/assets/news/buy-protection.svg';
import chatIcon from '~/assets/news/chat.png';
import depositImage from '~/assets/news/deposit.png';
import editIcon from '~/assets/news/edit.svg';
import instructionBanner from '~/assets/news/instruction_banner.png';
import instructionStep1 from '~/assets/news/instruction_step_1.svg';
import instructionStep2 from '~/assets/news/instruction_step_2.svg';
import instructionStep3 from '~/assets/news/instruction_step_3.svg';
import instructionStep4 from '~/assets/news/instruction_step_4.svg';
import phoneCallIcon from '~/assets/news/phone-call.svg';
import Loading from '~/component/Elements/loading/Loading';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { GET_CHAT_DATA_API } from '~/contexts/Socket/Type';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { chatSlice, IMessage } from '~/store/chatSlice';
import { NewsResponse, NewsStatus } from '~/types/home/news';
import { Identifier } from '~/types/shared';
import DateTimeUtil from '~/util/DateTimeUtil';
import LocaleUtil from '~/util/LocaleUtil';
import { NEWS_DETAIL_API, NEWS_OTHER_API, NEWS_RELATION_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import CarouselLayout from '../../layout/CarouselLayout';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import NewsInfo from '../main/NewsInfo';

const getNewsDetail = (id: string | undefined) => {
    if (!id) return;
    return requestApi<NewsResponse>('get', NEWS_DETAIL_API + '/' + id);
};

const getNewsRelation = (newsId?: Identifier, userId?: Identifier, categoryId?: Identifier) => {
    return Promise.all([
        requestApi<NewsResponse[]>(
            'get',
            NEWS_OTHER_API,
            {},
            {
                params: {
                    userId,
                    newsId,
                },
            },
        ),
        requestApi<NewsResponse[]>(
            'get',
            NEWS_RELATION_API,
            {},
            {
                params: {
                    categoryId,
                    newsId,
                },
            },
        ),
    ]);
};

const BuyProtection = ({ id }: { id: string }) => {
    return (
        <div className="w-full text-[#222] pt-3">
            <div>
                <img src={instructionBanner} width={'100%'} alt="" />
            </div>
            <div className="mt-2 px-2">
                <div>
                    <div className="font-bold text-[20px] mb-2">Quy trình mua hàng</div>
                    <div className="mb-[20px]">
                        Bạn có thể thanh toán trực tiếp trên nền tảng Chợ Đồ Si. Tiền hàng được hoàn trả 100% trong vòng{' '}
                        <b>7 ngày</b> giao dịch.
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center mb-8">
                        <img src={instructionStep1} width={40} />
                        <div className="text-md flex flex-col ml-3">
                            <div className="uppercase">Bước 1</div>
                            <div className="font-bold">
                                Bấm <span className="uppercase text-ơ#589f39]">Mua ngay</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mb-8">
                        <img src={instructionStep2} width={40} />
                        <div className="text-md flex flex-col ml-3">
                            <div className="uppercase">Bước 2</div>
                            <div className="font-bold">Điền thông tin & thanh toán</div>
                        </div>
                    </div>
                    <div className="flex items-center mb-8">
                        <img src={instructionStep3} width={40} />
                        <div className="text-md flex flex-col ml-3">
                            <div className="uppercase">Bước 3</div>
                            <div className="font-bold">Chờ người bán chốt đơn</div>
                        </div>
                    </div>
                    <div className="flex items-center ">
                        <img src={instructionStep4} width={40} />
                        <div className="text-md flex flex-col ml-3">
                            <div className="uppercase">Bước 4</div>
                            <div className="font-bold">Nhận hàng từ người bán</div>
                        </div>
                    </div>
                </div>
                <hr className="my-5" />
                <Link
                    className={clsx(
                        'w-full uppercase font-bold text-white text-[13px] mb-2 hover:text-white',
                        'bg-[#589f39] py-2 rounded flex justify-center items-center cursor-pointer',
                    )}
                    to={'/news/checkout/' + id}
                >
                    Mua ngay
                </Link>
            </div>
        </div>
    );
};

type State = {
    listNewsOther: NewsResponse[];
    listNewsRelation: NewsResponse[];
    isChatBox?: boolean;
};

const NewsDetail: React.FC = () => {
    const navigate = useNavigate();
    const { isShow } = useSelector((state: RootState) => state.chat);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const { setShowChat, sendMessage } = chatSlice.actions;
    const dispatch = useDispatch();
    const { id } = useParams();
    const { data: requestNews, isLoading } = useQuery([`GET_NEWS_DETAIL_${id}`], () => getNewsDetail(id));
    const news = requestNews?.data?.result;
    const [state, setState] = useMergeState<State>({
        listNewsOther: [],
        listNewsRelation: [],
    });
    const modalRef = useRef<ModalRef>(null);

    useEffect(() => {
        (async () => {
            if (!!news) {
                const [resNewsOther, resNewRelation] = await getNewsRelation(news?.id, news?.userId, news?.categoryId);
                setState({
                    listNewsOther: resNewsOther.data.result ?? [],
                    listNewsRelation: resNewRelation.data.result ?? [],
                });
            }
        })();
    }, [id, news?.categoryId, news?.id, news?.userId]);

    const chatMessage = async () => {
        const chatMessage = await requestApi(
            'get',
            GET_CHAT_DATA_API,
            { users: [authUser?.user?.id ?? '', news?.userId.toString() ?? ''] },
            {},
        );

        if (chatMessage.data?.success) {
            console.log([authUser?.user?.id ?? '', news?.userId.toString() ?? '']);
            const messageList: IMessage[] = _.get(chatMessage.data, 'result.message', []);
            const roomId = _.get(chatMessage.data, 'result.roomId', '');
            dispatch(setShowChat({ isShow: !isShow, userChatId: news?.userId.toString() ?? '' }));
            dispatch(
                sendMessage({
                    roomId,
                    users: [authUser?.user?.id ?? '', news?.userId.toString() ?? ''],
                    message: messageList,
                }),
            );
        } else {
            console.log(2);
            dispatch(setShowChat({ isShow: !isShow, userChatId: news?.userId.toString() ?? '' }));
            dispatch(
                sendMessage({
                    roomId: Math.random().toString().substring(10),
                    users: [authUser?.user?.id ?? '', news?.userId.toString() ?? ''],
                }),
            );
        }
    };

    const isOnSell = useMemo(() => news?.status === NewsStatus.OnSell, [news?.status]);
    const isOwnNews = useMemo(() => news?.userId === authUser?.user.id, [authUser?.user.id, news?.userId]);
    const isSellOnline = useMemo(() => news?.isOnline, [news?.isOnline]);

    if (isLoading) return <Loading />;
    if (!isOnSell || !news) return <Empty description="Xin lỗi, tin này đã ẩn hoặc không tồn tại!" />;
    return (
        <div>
            <BoxContainer>
                <div className={clsx('px-1 py-1 flex flex-col news-detail')}>
                    <div className="w-full flex items-center h-[50px]">
                        <HomeBreadCrumb
                            item={[
                                {
                                    title: 'Trang chủ',
                                    link: '/',
                                },
                                {
                                    title: 'Tìm kiếm',
                                    link: '/category',
                                },
                                {
                                    title: news?.title ?? '',
                                },
                            ]}
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="w-2/3 overflow-y-auto max-h-screen news-detail-left">
                            <div className="relative flex items-center justify-center bg-[#eee]">
                                <CarouselLayout
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                    infinite
                                    wrapperClassName="w-[580px] h-[580px]"
                                >
                                    {news?.imageUrls.map(url => {
                                        return (
                                            <Image
                                                width={580}
                                                height={580}
                                                className="object-contain"
                                                key={url}
                                                // preview={false}
                                                src={url}
                                                fallback={emptyImage}
                                            />
                                        );
                                    })}
                                </CarouselLayout>
                                <div
                                    className={clsx(
                                        'absolute w-full h-7 bg-black opacity-80 text-white',
                                        ' flex items-center justify-end bottom-0 pr-1 text-sm select-none',
                                    )}
                                >
                                    {DateTimeUtil.fromNow(news?.createdAt)}
                                </div>
                            </div>
                            <div>
                                <div className="text-base font-bold mt-4 mb-2">{news?.title}</div>
                                <div className="text-base font-bold text-red-500 mb-2">
                                    {LocaleUtil.toLocaleString(news?.price ?? 0)} VND
                                </div>
                                <div>
                                    {news?.description.split('\n').map((x, index) => {
                                        return <div key={index}>{x}</div>;
                                    })}
                                </div>
                                <div className="mt-2">
                                    Số điện thoại: <strong>{news?.phoneNumber}</strong>
                                </div>
                                <div className="text-base font-bold pb-1 border-b border-gray-200 my-2">Khu vực</div>
                                <div className="">
                                    <BaseIcon icon={faLocationPin} className="mr-1" /> {news?.address}, {news?.wardName}
                                    , {news?.districtName}, {news?.provinceName}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 flex flex-col ml-4">
                            <div className="">
                                <div className="w-full flex">
                                    <div className="w-[46px]">
                                        <Avatar size={46} src={news?.avatar} />
                                    </div>
                                    <div className="w-3/5 flex flex-col ml-2">
                                        <div
                                            className="text-[#2a5079] hover:text-[#2a5079] font-bold text-[13px] mt-0.5 cursor-pointer"
                                            onClick={() => navigate(`/user/info/${news.userId}`)}
                                        >
                                            {news?.fullName}
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <span
                                                className={clsx('w-2 h-2 rounded-full bg-[#9b9b9b]')}
                                                style={{
                                                    background: '#589f39',
                                                }}
                                            />
                                            <span className="text-[11px] text-[#9b9b9b] ml-1.5">Đang hoạt động</span>
                                        </div>
                                    </div>
                                    <div className="w-2/5 flex items-center justify-center">
                                        <div
                                            className={clsx(
                                                'py-1.5 px-3 flex items-center justify-center cursor-pointer rounded-2xl ',
                                                'border border-[#fe9900] text-[#fe9900] text-[10px]',
                                            )}
                                        >
                                            Xem trang
                                        </div>
                                    </div>
                                </div>
                                {isSellOnline && !isOwnNews && (
                                    <>
                                        <div
                                            className="w-full flex items-center justify-between p-3 rounded cursor-pointer bg-[#f8f8f8] mt-5"
                                            onClick={() =>
                                                modalRef.current?.onOpen(
                                                    <BuyProtection id={news.id} />,
                                                    '',
                                                    '35%',
                                                    undefined,
                                                )
                                            }
                                        >
                                            <div className="w-8">
                                                <img src={buyProtectionIcon} alt="" width={32} height={32} />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="font-bold text-black text-sm">
                                                    Thanh toán đảm bảo khi MUA NGAY
                                                </div>
                                                <div className="text-black text-xs mt-0.5">
                                                    Hoàn tiền 100% nếu không nhận được hàng
                                                </div>
                                            </div>
                                            <div className="w-2.5">
                                                <img src={backIcon} width={10} alt="" className="rotate-180" />
                                            </div>
                                        </div>
                                        <div
                                            className={clsx(
                                                'flex items-center justify-center rounded-lg py-2.5 px-4 border border-[#589f39] text-[#589f39] mt-5',
                                                'cursor-pointer hover:bg-gray-100 duration-150',
                                            )}
                                            onClick={() => navigate('/news/checkout/' + id)}
                                        >
                                            <div className="font-bold text-base ml-3 uppercase">Mua ngay</div>
                                        </div>
                                    </>
                                )}
                                <div
                                    className={clsx(
                                        'flex items-center justify-between rounded-lg py-2.5 px-4 border-none outline-none bg-[#589f39] text-white mt-3',
                                        // 'hover:bg-opacity-95 cursor-pointer',
                                    )}
                                >
                                    <img src={phoneCallIcon} width={24} />
                                    <div className="font-bold text-base ml-3">{news?.phoneNumber}</div>
                                </div>
                                {!isOwnNews ? (
                                    <div
                                        className={clsx(
                                            'flex items-center justify-between rounded-lg py-2.5 px-4 border border-[#589f39] text-[#589f39] mt-3',
                                            'cursor-pointer hover:bg-gray-100 duration-150',
                                        )}
                                        onClick={chatMessage}
                                    >
                                        <img src={chatIcon} width={24} />
                                        <div className="font-bold text-base ml-3 uppercase">chat với người bán</div>
                                    </div>
                                ) : (
                                    <div
                                        className={clsx(
                                            'flex items-center justify-between rounded-lg py-2.5 px-4 border border-[#589f39] text-[#589f39] mt-3',
                                            'cursor-pointer hover:bg-gray-100 duration-150',
                                        )}
                                        onClick={() => navigate(`/news/edit/${news?.id}`)}
                                    >
                                        <img src={editIcon} width={24} />
                                        <div className="font-bold text-base ml-3">Sửa tin</div>
                                    </div>
                                )}

                                <div className="mt-5 flex">
                                    <img src={depositImage} width={85} />
                                    <div className="ml-2 mt-2">
                                        <div className="text-[12px] italic text-[#222] ">
                                            Chúng tôi sẽ là trung gian nhận tiền trong lúc đợi người bán giao hàng. Đừng
                                            lo nhé!
                                        </div>
                                        <div className="text-[12px] text-[#fe9900] italic mt-1 cursor-pointer">
                                            Tìm hiểu thêm »
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BoxContainer>
            {state.listNewsOther.length > 0 && (
                <BoxContainer className="mt-5">
                    <div className="w-full flex items-center justify-between">
                        <b className="text-base">
                            Tin rao khác của <span className="uppercase">{news?.fullName}</span>
                        </b>
                        <Link
                            to={`/user/info/${news.userId}`}
                            className="text-[#4a90e2] hover:text-[#4a90e2] hover:underline"
                        >
                            Xem tất cả
                        </Link>
                        {/* TODO: Link qua trang cá nhân */}
                    </div>
                    <CarouselLayout slidesToShow={5} slidesToScroll={1}>
                        {state.listNewsOther.map(news => (
                            <div className="flex flex-col items-center justify-center w-[20%] m-1" key={news.id}>
                                <NewsInfo news={news} />
                            </div>
                        ))}
                    </CarouselLayout>
                </BoxContainer>
            )}
            {state.listNewsRelation.length > 0 && (
                <BoxContainer className="mt-5">
                    <div className="w-full flex items-center justify-between">
                        <b className="text-base">Tin đăng tương tự</b>
                        <Link
                            to={`/category?categorySlug=${news?.slug}`}
                            className="text-[#4a90e2] hover:text-[#4a90e2] hover:underline"
                        >
                            Xem thêm
                        </Link>
                    </div>
                    <CarouselLayout slidesToShow={5} slidesToScroll={1}>
                        {state.listNewsRelation.map(news => (
                            <div className="flex flex-col items-center justify-center w-[19.5%] m-1" key={news.id}>
                                <NewsInfo news={news} />
                            </div>
                        ))}
                    </CarouselLayout>
                </BoxContainer>
            )}
            <ModalBase ref={modalRef} hideTitle className="detail-modal" />
        </div>
    );
};

export default NewsDetail;
