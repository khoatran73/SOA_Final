import { Image } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router-dom';
import bumpArrowIcon from '~/assets/news/bump-arrow.svg';
import bumpFlashIcon from '~/assets/news/bump-flash.svg';
import bumpImageIcon from '~/assets/news/bump-image.svg';
import bumpPriorityIcon from '~/assets/news/bump-priority.svg';
import newServiceIcon from '~/assets/news/new-service.svg';
import { VND_CHAR } from '~/configs';
import BoxContainer from '../../layout/BoxContainer';

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

const Card = (props: CardProps) => {
    return <div className={clsx('rounded-sm p-3 border-b px-6', props.className)}>{props.children}</div>;
};

type State = {
    bumpService?: number;
    bumpImage?: number;
    bumpPriority?: number;
};

const NewsPush: React.FC = () => {
    const { id } = useParams(); //news id
    const discountClassName =
        'inline-flex h-5 items-center justify-center rounded bg-red-2 px-0.5 text-xs font-bold text-white';
    const smallCardClassName = clsx(
        'min-h-[72px] min-w-[116px] flex-1 cursor-pointer select-none rounded border px-3 pt-4 pb-2 ',
        'md:min-h-[88px] md:px-[15px] md:py-3 hover:border-green-4 hover:bg-green-5',
    );

    return (
        <BoxContainer className="px-0">
            <div>
                <Card>Breadcrumb</Card>
                <Card>
                    <div className="flex gap-4">
                        <div className="relative h-[108px] w-[108px] flex-shrink-0 bg-[url('https://static.chotot.com/storage/default_images/c2c_ad_image.jpg')] bg-cover bg-center">
                            <img
                                alt=" "
                                className="h-full w-full object-cover"
                                src="https://cdn.chotot.com/49wTzr3YqVXeNWW-kuIjSnLSPQ6ksQrTH7LJHU9SEYg/preset:listing/plain/501826f2a855c31732472d5eaed447fb-2796999207917424547.jpg"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="h-5 max-w-[50%] truncate">Tôi muốn bán bánh kẹo</div>
                            <div className="mt-1.5 font-bold text-red-2">230.002 đ</div>
                        </div>
                    </div>
                </Card>
                <Card className="border-none">
                    <>
                        <div className="my-2 font-bold">Đẩy tin ngay</div>
                        <div className="flex w-1/2 no-scrollbar relative flex-nowrap justify-between gap-2 rounded mt-4">
                            <div className={smallCardClassName}>
                                <div className="flex items-center justify-between">
                                    <div>7 ngày</div>
                                    <div>
                                        <Image src={bumpArrowIcon} preview={false} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-green-2">32.000 {VND_CHAR}</div>
                                        <div className="text-xs italic text-gray-0 line-through">35.000 {VND_CHAR}</div>
                                    </div>
                                    <div>
                                        <span className={discountClassName}>-10%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={smallCardClassName}>
                                <div className="flex items-center justify-between">
                                    <div>3 ngày</div>
                                    <div>
                                        <Image src={bumpArrowIcon} preview={false} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-green-2">14.000 {VND_CHAR}</div>
                                        <div className="text-xs italic text-gray-0 line-through">15.000 {VND_CHAR}</div>
                                    </div>
                                    <div>
                                        <span className={discountClassName}>-5%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={smallCardClassName}>
                                <div className="flex items-center justify-between">
                                    <div>1 ngày</div>
                                    <div>
                                        <Image src={bumpFlashIcon} preview={false} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-green-2">5.000 {VND_CHAR}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-1/2 rounded mt-4">
                            <div
                                className={clsx(
                                    'border-[#e8e8e8] hover:border-green-4 hover:bg-green-5 relative flex',
                                    'min-h-[101px] cursor-pointer flex-col rounded border p-3 w-full',
                                )}
                            >
                                <>
                                    <div>
                                        <div className="flex justify-between">
                                            <div className="capitalize">Tin Nổi Bật (Nhiều hình ảnh)</div>
                                            <img alt="icon" className="h-6" src={bumpImageIcon} />
                                        </div>
                                        <div className="mt-1 text-xs font-bold text-green-2">10.000 đ / 7 ngày</div>
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
                                </>
                            </div>
                        </div>
                        <div className="my-2 font-bold">Các tiện ích nâng cao</div>
                        <div className="flex w-1/2 rounded mt-4">
                            <div
                                className={clsx(
                                    'border-[#e8e8e8] hover:border-green-4 hover:bg-green-5 relative flex',
                                    'min-h-[101px] cursor-pointer flex-col rounded border p-3 w-full',
                                )}
                            >
                                <>
                                    <div>
                                        <div className="flex justify-between">
                                            <div className="capitalize">Tin Ưu Tiên</div>
                                            <img alt="icon" className="h-6" src={bumpPriorityIcon} />
                                        </div>
                                        <div className="mt-1 text-xs font-bold text-green-2">20.000 đ / ngày</div>
                                    </div>
                                    <div className="flex-1" />
                                    <div className="text-[10px] opacity-50">
                                        Tin xuất hiện ở 1-5 vị trí đầu tiên của trang
                                    </div>
                                </>
                            </div>
                        </div>
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
                    <button className="h-10 flex-1 rounded bg-gray-2 text-xs font-bold uppercase text-white w-1/2 mr-1">
                        THANH TOÁN
                    </button>
                    <div className="flex h-10 flex-1 cursor-pointer items-center justify-center rounded border text-xs uppercase hover:bg-gray-5 w-[calc(50%-10px)]">
                        QUAY LẠI
                    </div>
                </div>
            </div>
        </BoxContainer>
    );
};

export default NewsPush;
