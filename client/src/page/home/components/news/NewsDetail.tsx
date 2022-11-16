import { faLocationPin, faMessage, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Image } from 'antd';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import ChatBox from '~/component/Elements/ChatBox/ChatBox';

import Loading from '~/component/Elements/loading/Loading';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import ErrorView from '~/component/Layout/ErrorView';
import { useSocket } from '~/contexts/Socket/Context';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { chatSlice, IMessage } from '~/store/chatSlice';
import { NewsResponse } from '~/types/home/news';
import { Identifier } from '~/types/shared';
import { NEWS_DETAIL_API, NEWS_OTHER_API, NEWS_RELATION_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import CarouselLayout from '../../layout/CarouselLayout';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import NewsInfo from '../main/NewsInfo';
import emptyImage from '~/assets/layout/empty.jpg';
import { GET_CHAT_DATA_API } from '~/contexts/Socket/Type';
import _ from 'lodash';

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

type State = {
    listNewsOther: NewsResponse[];
    listNewsRelation: NewsResponse[];
    isChatBox?: boolean;
};

const NewsDetail: React.FC = () => {
    const { isShow } = useSelector((state: RootState) => state.chat);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const { setShowChat, sendMessage } = chatSlice.actions;
    const dispatch = useDispatch();
    const { id } = useParams();
    const { data: requestNews, isLoading, isError } = useQuery([`GET_NEWS_DETAIL_${id}`], () => getNewsDetail(id));
    const news = requestNews?.data?.result;
    const [state, setState] = useMergeState<State>({
        listNewsOther: [],
        listNewsRelation: [],
    });

    useEffect(() => {
        (async () => {
            const [resNewsOther, resNewRelation] = await getNewsRelation(news?.id, news?.userId, news?.categoryId);
            setState({
                listNewsOther: resNewsOther.data.result ?? [],
                listNewsRelation: resNewRelation.data.result ?? [],
            });
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
            console.log([authUser?.user?.id ?? '', news?.userId.toString() ?? ''])
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
            console.log(2)
            dispatch(setShowChat({ isShow: !isShow, userChatId: news?.userId.toString() ?? '' }));
            dispatch(
                sendMessage({
                    roomId: Math.random().toString().substring(10),
                    users: [authUser?.user?.id ?? '', news?.userId.toString() ?? ''],
                }),
            );
        }
    };
    if (isError) return <ErrorView />;
    if (isLoading) return <Loading />;
    return (
        <div>
            <BoxContainer>
                <div className={clsx('px-4 py-2 flex flex-col news-detail')}>
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
                            <div className="relative flex items-center justify-center bg-gray-200">
                                <CarouselLayout
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                    wrapperClassName="w-[500px] h-[500px]"
                                >
                                    {news?.imageUrls.map(url => {
                                        return (
                                            <Image
                                                width={500}
                                                height={500}
                                                className="object-contain bg-red-100"
                                                key={url}
                                                preview={false}
                                                src={url}
                                                fallback={emptyImage}
                                            />
                                        );
                                    })}
                                </CarouselLayout>
                                <div className="absolute w-full h-7 bg-black opacity-70 text-white flex items-center justify-end bottom-0 pr-1">
                                    {moment(news?.createdAt).locale('vi').fromNow()}
                                </div>
                            </div>
                            <div>
                                <div className="text-base font-bold mt-4 mb-2">{news?.title}</div>
                                <div className="text-base font-bold text-red-500 mb-2">
                                    {news?.price.toLocaleString()} VND
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
                                    <BaseIcon icon={faLocationPin} className="mr-1" /> {news?.wardName},{' '}
                                    {news?.districtName}, {news?.provinceName}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 flex flex-col ml-4">
                            <div className="">
                                <div className="w-full flex">
                                    <div className="w-[72px]">
                                        <Avatar size={54}>K</Avatar>
                                    </div>
                                    <div className="w-3/5">{news?.fullName}</div>
                                    <div className="flex items-center justify-center">
                                        <div className="w-[100px] h-[32px] flex items-center justify-center cursor-pointer rounded-2xl border border-orange-400 text-orange-400 ">
                                            xem trang
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-between rounded-lg py-2 px-4 border-none outline-none bg-green-700 text-white mt-5',
                                        'hover:bg-opacity-95 cursor-pointer',
                                    )}
                                >
                                    <BaseIcon icon={faPhoneAlt} size="lg" />
                                    <div className="font-bold text-base ml-3">{news?.phoneNumber}</div>
                                </div>
                                <div
                                    className={clsx(
                                        'flex items-center justify-between rounded-lg py-2 px-4 border border-green-700 text-green-700 mt-5',
                                        'cursor-pointer hover:bg-gray-100 duration-150',
                                    )}
                                    onClick={chatMessage}
                                >
                                    <BaseIcon icon={faMessage} size="lg" />
                                    <div className="font-bold text-base ml-3 uppercase">chat voi nguoi ban</div>
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
                        <div>Xem tat ca</div>
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
            <BoxContainer className="mt-5">
                <div className="w-full flex items-center justify-between">
                    <b className="text-base">Tin đăng tương tự</b>
                    <Link to={`/category?categorySlug=${news?.slug}`}>Xem thêm</Link>
                </div>
                <CarouselLayout slidesToShow={5} slidesToScroll={1}>
                    {state.listNewsRelation.map(news => (
                        <div className="flex flex-col items-center justify-center w-[19.5%] m-1" key={news.id}>
                            <NewsInfo news={news} />
                        </div>
                    ))}
                </CarouselLayout>
            </BoxContainer>
        </div>
    );
};

export default NewsDetail;
