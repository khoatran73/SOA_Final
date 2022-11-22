import { Image } from 'antd';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState, useAppState } from '~/AppStore';
import bumpArrowIcon from '~/assets/news/bump-arrow.svg';
import bumpFlashIcon from '~/assets/news/bump-flash.svg';
import bumpImageIcon from '~/assets/news/bump-image.svg';
import newServiceIcon from '~/assets/news/new-service.svg';
import tickIcon from '~/assets/news/tick.svg';
import { VND_CHAR } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useNewsDetail } from '~/hook/useNewsDetail';
import { requestApi } from '~/lib/axios';
import { fetchAuthDataAsync } from '~/store/authSlice';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';
import BoxContainer from '../../layout/BoxContainer';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import { NEWS_UPDATE_BUMP_API } from './../../api/api';

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

const Card = (props: CardProps) => {
    return <div className={clsx('rounded-sm p-3 border-b px-6', props.className)}>{props.children}</div>;
};

const calculateOriginalPrice = (priceOneDay: number, day: number) => {
    return priceOneDay * day;
};

const calculateDiscountPrice = (priceOneDay: number, day: number, discount: number) => {
    const originPrice = calculateOriginalPrice(priceOneDay, day);
    return originPrice * (1 - discount);
};

// default
const BumpPriorityDefaultPerDay = 5000;
const ThreeDaysDiscount = 0.05;
const ThreeNumber = 3;
const SevenDayDiscount = 0.1;
const SevenNumber = 7;
// count
const BumpPriorityPerThreeDay = calculateOriginalPrice(BumpPriorityDefaultPerDay, ThreeNumber);
const BumpPriorityPerThreeDayDiscount = calculateDiscountPrice(
    BumpPriorityDefaultPerDay,
    ThreeNumber,
    ThreeDaysDiscount,
);
const BumpPriorityPerSevenDay = calculateOriginalPrice(BumpPriorityDefaultPerDay, SevenNumber);
const BumpPriorityPerSevenDayDiscount = calculateDiscountPrice(
    BumpPriorityDefaultPerDay,
    SevenNumber,
    SevenDayDiscount,
);
// image
const BumpImagePerSevenDay = 10000;

const NewsPush: React.FC = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);
    const dispatch = useDispatch();
    const { id } = useParams(); //news id
    const { data: responseNews, isLoading } = useNewsDetail(id);
    const news = responseNews?.data?.result;
    const [bumpPriority, setBumpPriority] = useState<{
        day: number;
        price: number;
    } | null>();
    const [bumpImage, setBumpImage] = useState<{
        day: number;
        price: number;
    } | null>();
    const navigate = useNavigate();

    const discountClassName =
        'inline-flex h-5 items-center justify-center rounded bg-red-2 px-0.5 text-xs font-bold text-white';
    const smallCardClassName = clsx(
        'min-h-[72px] min-w-[116px] flex-1 cursor-pointer select-none rounded border px-3 pt-4 pb-2 ',
        'md:min-h-[88px] md:px-[15px] md:py-3 hover:border-green-4 hover:bg-green-5 relative',
    );

    const handleBumpPriority = (day: number, price: number) => {
        // click 2 cái => remove
        if (bumpPriority && bumpPriority.day === day) {
            setBumpPriority(null);
            return;
        }

        setBumpPriority({
            day: day,
            price: price,
        });
        return;
    };

    const handleBumpImage = (day: number = SevenNumber, price: number = BumpImagePerSevenDay) => {
        if (bumpImage) {
            setBumpImage(null);
            return;
        }

        setBumpImage({
            day,
            price,
        });
    };

    const handlePayment = async () => {
        const coinRemain =
            Number(authUser?.user?.amount ?? 0) - Number(bumpImage?.price ?? 0) - Number(bumpPriority?.price ?? 0);
        if (coinRemain < 0) {
            NotifyUtil.error(NotificationConstant.TITLE, 'Bạn không đủ coin để thực hiện hành động này!');
            return;
        }
        const confirm = await NotifyUtil.confirmDialog(
            NotificationConstant.TITLE,
            `Bạn sẽ còn ${LocaleUtil.toLocaleString(coinRemain)} coin sau khi thực hiện hành động này`,
        );
        if (!confirm.isConfirmed) {
            return;
        }

        if (!bumpImage && !bumpPriority) return;

        const body = {
            bumpImage,
            bumpPriority,
        };

        const response = await requestApi('put', NEWS_UPDATE_BUMP_API + '/' + id, body);
        if (response.data.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_UPDATE_SUCCESS);
            dispatch(fetchAuthDataAsync());
            navigate(-1);
            return;
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
    };

    return (
        <BoxContainer className="px-0">
            <div>
                <Card className="pt-0">
                    <HomeBreadCrumb
                        item={[
                            { title: 'Trang chủ', link: '/' },
                            { title: 'Quản lý tin', link: '/news/dashboard' },
                            { title: 'Đẩy tin' },
                        ]}
                        className="p-0"
                        style={{ margin: 0 }}
                    />
                </Card>
                <Card>
                    <div className="flex gap-4">
                        <div className="relative h-[108px] w-[108px] flex-shrink-0">
                            <img alt=" " className="h-full w-full object-cover" src={news?.imageUrls[0]} />
                        </div>
                        <div className="flex-1">
                            <div className="h-5 max-w-[50%] truncate">{news?.title}</div>
                            <div className="mt-1.5 font-bold text-red-2">
                                {LocaleUtil.toLocaleString(news?.price ?? 0)} {VND_CHAR}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card className="border-none">
                    <>
                        <div className="my-2 font-bold">Đẩy tin ngay</div>
                        <div className="flex w-1/2 no-scrollbar relative flex-nowrap justify-between gap-2 rounded mt-4">
                            <div
                                className={clsx(
                                    smallCardClassName,
                                    bumpPriority?.day === SevenNumber
                                        ? 'bg-green-5 border-green-2 hover:bg-green-5 hover:border-green-2'
                                        : '',
                                )}
                                onClick={() => handleBumpPriority(SevenNumber, BumpPriorityPerSevenDayDiscount)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>{SevenNumber} ngày</div>
                                    <div>
                                        <Image src={bumpArrowIcon} preview={false} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-green-2">
                                            {LocaleUtil.toLocaleString(BumpPriorityPerSevenDayDiscount)} {VND_CHAR}
                                        </div>
                                        <div className="text-xs italic text-gray-0 line-through">
                                            {LocaleUtil.toLocaleString(BumpPriorityPerSevenDay)} {VND_CHAR}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={discountClassName}>-{SevenDayDiscount * 100}%</span>
                                    </div>
                                </div>
                                {bumpPriority?.day === SevenNumber && (
                                    <div className="absolute -top-2 -right-2">
                                        <img src={tickIcon} width={20} height={20} alt="" />
                                    </div>
                                )}
                            </div>
                            <div
                                className={clsx(
                                    smallCardClassName,
                                    bumpPriority?.day === ThreeNumber
                                        ? 'bg-green-5 border-green-2 hover:bg-green-5 hover:border-green-2'
                                        : '',
                                )}
                                onClick={() => handleBumpPriority(ThreeNumber, BumpPriorityPerThreeDayDiscount)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>{ThreeNumber} ngày</div>
                                    <div>
                                        <Image src={bumpArrowIcon} preview={false} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-green-2">
                                            {LocaleUtil.toLocaleString(BumpPriorityPerThreeDayDiscount)} {VND_CHAR}
                                        </div>
                                        <div className="text-xs italic text-gray-0 line-through">
                                            {LocaleUtil.toLocaleString(BumpPriorityPerThreeDay)} {VND_CHAR}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={discountClassName}>-{ThreeDaysDiscount * 100}%</span>
                                    </div>
                                </div>
                                {bumpPriority?.day === ThreeNumber && (
                                    <div className="absolute -top-2 -right-2">
                                        <img src={tickIcon} width={20} height={20} alt="" />
                                    </div>
                                )}
                            </div>
                            <div
                                className={clsx(
                                    smallCardClassName,
                                    bumpPriority?.day === 1
                                        ? 'bg-green-5 border-green-2 hover:bg-green-5 hover:border-green-2'
                                        : '',
                                )}
                                onClick={() => handleBumpPriority(1, BumpPriorityDefaultPerDay)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>1 ngày</div>
                                    <div>
                                        <Image src={bumpFlashIcon} preview={false} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-green-2">
                                            {LocaleUtil.toLocaleString(BumpPriorityDefaultPerDay)} {VND_CHAR}
                                        </div>
                                    </div>
                                </div>
                                {bumpPriority?.day === 1 && (
                                    <div className="absolute -top-2 -right-2">
                                        <img src={tickIcon} width={20} height={20} alt="" />
                                    </div>
                                )}
                            </div>
                        </div>
                        {!news?.bumpImage && (
                            <div className="flex w-1/2 rounded mt-4">
                                <div
                                    className={clsx(
                                        'hover:border-green-4 hover:bg-green-5 relative flex',
                                        'min-h-[101px] cursor-pointer flex-col rounded border p-3 w-full',
                                        bumpImage
                                            ? 'bg-green-5 border-green-2 hover:bg-green-5 hover:border-green-2'
                                            : '',
                                    )}
                                    onClick={() => handleBumpImage(100000, BumpImagePerSevenDay)} //vinh vien
                                >
                                    <div>
                                        <div className="flex justify-between">
                                            <div className="capitalize">Tin Nổi Bật (Nhiều hình ảnh)</div>
                                            <img alt="icon" className="h-6" src={bumpImageIcon} />
                                        </div>
                                        <div className="mt-1 text-xs font-bold text-green-2">
                                            {LocaleUtil.toLocaleString(BumpImagePerSevenDay)} {VND_CHAR} / Vĩnh viễn
                                        </div>
                                    </div>
                                    <div className="flex-1" />
                                    <div className="text-[10px] opacity-50">
                                        <div>
                                            <span className="text-red-2">*</span>Gấp đôi khả năng thu hút khách hàng
                                        </div>
                                        <div>
                                            <span className="text-red-2">*</span>Gấp đôi kích thước tin đăng với thêm 5
                                            hình ảnh hiển thị
                                        </div>
                                    </div>
                                    <img
                                        alt="new-service"
                                        className="absolute -left-[16px] -top-[20px]"
                                        height="50"
                                        src={newServiceIcon}
                                        width="110"
                                    />
                                    {bumpImage && (
                                        <div className="absolute -top-2 -right-2">
                                            <img src={tickIcon} width={20} height={20} alt="" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                </Card>
            </div>
            <div>
                <div
                    className={clsx(
                        'sticky bottom-0 z-20 m-auto flex h-[110px] max-w-[940px]',
                        'flex-col bg-white pb-5 pt-3 md:h-[64px] md:max-w-full md:flex-row md:py-3 md:px-3 px-3',
                    )}
                >
                    <button
                        className={clsx(
                            'h-10 flex-1 rounded bg-gray-2 text-xs font-bold uppercase text-white w-1/2 mr-1',
                            bumpPriority || bumpImage ? 'bg-green-2' : '',
                        )}
                        onClick={handlePayment}
                    >
                        THANH TOÁN
                    </button>
                    <div
                        className={clsx(
                            'flex h-10 flex-1 cursor-pointer items-center justify-center hover:bg-gray-5',
                            'rounded border text-xs uppercase hover:bg-gray-5 w-[calc(50%-10px)]',
                        )}
                        onClick={() => navigate(-1)}
                    >
                        QUAY LẠI
                    </div>
                </div>
            </div>
        </BoxContainer>
    );
};

export default NewsPush;
