import React, { useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '~/component/Elements/loading/Loading';
import { API_GET_USER } from '~/configs';
import { requestApi } from '~/lib/axios';
import { User } from '~/types/ums/AuthUser';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import BoxContainer from './../../layout/BoxContainer';
import calendarIcon from '~/assets/calendar.png';
import locationIcon from '~/assets/location.png';
import defaultAvatar from '~/assets/default-avatar.png';
import moment from 'moment';
import DateTimeUtil from '~/util/DateTimeUtil';
import { NEWS_BY_USER_ID_API } from '../../api/api';
import { NewsSearch, NewsStatus } from '~/types/home/news';
import { Empty } from 'antd';
import { EMPTY_DESCRIPTION } from '~/configs/contants';
import NewsResultSearchInfo from '../news/NewsResultSearchInfo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/AppStore';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import UserEdit from './UserEdit';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { fetchAuthDataAsync } from '~/store/authSlice';

const getUser = (id: string | undefined) => {
    return requestApi<{ user: User }>('get', API_GET_USER, { id: id });
};

const getNewsByUserId = (userId?: string) => {
    return requestApi<NewsSearch[]>('get', NEWS_BY_USER_ID_API, {}, { params: { userId } });
};

const UserInfo: React.FC = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const modalRef = useRef<ModalRef>(null);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const { data: requestUser, isLoading: isLoadingUser } = useQuery([`GET_USER_${id}`], () => getUser(id));
    const user = requestUser?.data?.result?.user;
    const { data: requestNews, isLoading: isLoadingNews } = useQuery(['GET_NEWS_DETAIL_BY_USER_ID'], () =>
        getNewsByUserId(id),
    );
    const listNews = requestNews?.data?.result ?? [];
    const listNewsOnSell = listNews.filter(x => x.status === NewsStatus.OnSell);

    const isOwn = useMemo(() => authUser?.user?.id === user?.id, [authUser?.user?.id, user?.id]);

    if (isLoadingUser || isLoadingNews) return <Loading />;
    return (
        <>
            <HomeBreadCrumb
                className="pb-2 px-3 pt-0"
                style={{
                    margin: 0,
                }}
                item={[
                    {
                        title: 'Trang chủ',
                        link: '/',
                    },
                    {
                        title: 'Trang cá nhân của ' + user?.fullName,
                    },
                ]}
            />
            <BoxContainer>
                <div className="w-full flex justify-between">
                    <div className="w-1/3 flex">
                        <img
                            width={80}
                            height={80}
                            className="object-cover"
                            src={!user?.avatar ? defaultAvatar : user?.avatar}
                            alt=""
                        />
                        <div className="ml-3">
                            <div className="text-lg mb-3">{user?.fullName}</div>
                            {isOwn && (
                                <div
                                    className="rounded-[20px] border text-md py-1 px-3 cursor-pointer"
                                    onClick={() =>
                                        modalRef?.current?.onOpen(
                                            <UserEdit
                                                onSubmitSuccessfully={() => {
                                                    modalRef.current?.onClose();
                                                    dispatch(fetchAuthDataAsync());

                                                    // gridController?.reloadData();
                                                    //TODO: dispatch check login
                                                }}
                                                user={user}
                                                onClose={modalRef.current?.onClose}
                                            />,
                                            'Chỉnh sửa trang cá nhân',
                                            '60%',
                                            faUserEdit,
                                        )
                                    }
                                >
                                    Chỉnh sửa trang cá nhân
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-2/3">
                        <div className="flex items-center text-[#9b9b9b]">
                            <img src={calendarIcon} alt="" width={18} height={18} />
                            <div className="flex items-center ml-2 text-[13px]">
                                <span className="">Ngày tham gia:</span>
                                <span className="text-[#282f39] ml-1">
                                    {!user?.createdAt
                                        ? 'Không có dữ liệu'
                                        : moment(user?.createdAt).format(DateTimeUtil.DmyFormat)}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center text-[#9b9b9b] mt-2">
                            <img src={locationIcon} alt="" width={18} height={18} />
                            <div className="flex items-center ml-2 text-[13px]">
                                <span className="">Địa chỉ:</span>
                                <span className="text-[#282f39] ml-1">
                                    {!user?.province
                                        ? 'Chưa cung cấp'
                                        : `${user?.address}, ${user?.wardName}, ${user?.districtName}, ${user?.provinceName}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </BoxContainer>
            <BoxContainer className="mt-3">
                <div className="text-lg text-[#222] pb-3 mb-3 border-b border-[#eee] font-bold">
                    Tin đang đăng <span className="font-medium text-[#999]">- {listNewsOnSell.length} tin</span>
                </div>
                {listNewsOnSell.length === 0 ? (
                    <Empty description={EMPTY_DESCRIPTION} />
                ) : (
                    listNewsOnSell.map(news => (
                        <div className="flex flex-col" key={news.id}>
                            <NewsResultSearchInfo news={news} />
                        </div>
                    ))
                )}
            </BoxContainer>
            <ModalBase ref={modalRef} />
        </>
    );
};

export default UserInfo;
