import { UploadOutlined } from '@ant-design/icons';
import { faClose, faImage } from '@fortawesome/free-solid-svg-icons';
import { Empty, Input, Select, Upload, UploadFile } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RcFile, UploadProps } from 'antd/lib/upload';
import clsx from 'clsx';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '~/AppStore';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Loading from '~/component/Elements/loading/Loading';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import Forbidden from '~/component/Layout/Forbidden';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { DISTRICT_COMBO_API, PROVINCE_COMBO_API, UPLOAD_FILE_API, WARD_COMBO_API } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { CATEGORY_COMBO_API } from '~/page/product/category/api/api';
import { PRODUCT_TYPE_COMBO_API } from '~/page/product/product-type/api/api';
import { NewsCreateRequest, NewsResponse, NewsStatus } from '~/types/home/news';
import { ComboOption, Identifier } from '~/types/shared';
import { BasePlacement, District, Placement, Province, Ward } from '~/types/shared/Placement';
import DateTimeUtil from '~/util/DateTimeUtil';
import FileUtil from '~/util/FileUtil';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';
import { NEWS_CREATE_API, NEWS_DETAIL_API, NEWS_UPDATE_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';

interface NewsRequest {
    categoryId: Identifier;
    productTypeId: Identifier;
    title: string;
    price: number;
    description: string;
    province: string;
    district: string;
    ward: string;
    address: string; //d/c cụ thể
}

interface State {
    //image
    imageList: UploadFile[];
    imageUrls: string[];
    //info:
    categories: ComboOption[];
    productTypes: ComboOption[];
    provinces: ComboOption[];
    districts: ComboOption[];
    wards: ComboOption[];
    loading: boolean;
    //descriptionCharacter
    descriptionCharacter: number;
    price: number;
}

const getNewsDetail = (id: string | undefined) => {
    if (!id) return;
    return requestApi<NewsResponse>('get', NEWS_DETAIL_API + '/' + id);
};

const DefaultImageCanUpload = 5;
const ImageExtraCanUpload = 5;

const calculateImageCanUpload = (toDateLeft?: string) => {
    const dateNow = moment().format();
    const remainMilliSeconds = DateTimeUtil.diffTwoStringDate(toDateLeft ?? '', dateNow);
    if (remainMilliSeconds > 0) return DefaultImageCanUpload + ImageExtraCanUpload;
    return DefaultImageCanUpload;
};

const NewsView: React.FC = () => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const { id } = useParams();
    const { authUser } = useSelector((state: RootState) => state.authData);
    const { data: requestNews, isLoading } = useQuery([`GET_NEWS_DETAIL_${id}`], () => getNewsDetail(id));
    const navigate = useNavigate();
    const news = requestNews?.data?.result;
    const numberImageCanUpload = calculateImageCanUpload(news?.bumpImage?.toDate?.toString());
    const isEditView = useMemo(() => !!id, [id]);
    const isOwnNews = useMemo(() => news?.userId === authUser?.user?.id, [authUser?.user?.id, news?.userId]);
    const isOnSell = useMemo(() => news?.status === NewsStatus.OnSell, [news?.status]);
    const [state, setState] = useMergeState<State>({
        imageList:
            news?.imageUrls?.map(
                url =>
                    ({
                        uid: url,
                        name: url,
                        url: url,
                        thumbUrl: url,
                    } as UploadFile),
            ) ?? [],
        imageUrls: news?.imageUrls || [],
        categories: [],
        provinces: [],
        districts: [],
        wards: [],
        productTypes: [],
        descriptionCharacter: news?.description.length ?? 0,
        price: news?.price ?? 0,
        loading: false,
    });

    const onSave = async () => {
        formRef.current?.onSubmit();

        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        if (state.imageUrls.length === 0) {
            NotifyUtil.error(NotificationConstant.TITLE, 'Vui lòng tải lên ít nhất một hình ảnh!');
            return;
        }

        const formValues = formRef.current?.getFieldsValue();
        const body = { ...formValues, imageUrls: state.imageUrls } as NewsCreateRequest;

        const isContainsBadWord = LocaleUtil.isContainsBadWords(body);
        if (isContainsBadWord) {
            NotifyUtil.error(NotificationConstant.TITLE, 'Tin của bạn chứa từ ngữ không phù hợp, vui lòng thử lại!');
            return;
        }

        if (!isEditView) {
            await onAddNews(body);
            return;
        }

        await onEditNews(body);
    };

    const onAddNews = async (body: NewsCreateRequest) => {
        const response = await requestApi('post', NEWS_CREATE_API, body);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_CREATE_SUCCESS);
            navigate('/news/dashboard');
            return;
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
    };

    const onEditNews = async (body: NewsCreateRequest) => {
        const response = await requestApi('put', NEWS_UPDATE_API + '/' + body.id, body);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_UPDATE_SUCCESS);
            navigate('/news/dashboard');
            return;
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
    };

    useEffect(() => {
        if (!isEditView)
            setState({
                imageList: [],
                imageUrls: [],
                categories: [],
                productTypes: [],
                provinces: [],
                districts: [],
                wards: [],
                descriptionCharacter: 0,
                price: 0,
                loading: false,
            });
        fetchComboOptions();
    }, [id]);

    const fetchComboOptions = () => {
        setState({ loading: true });
        Promise.all([
            requestApi<ComboOption[]>('get', CATEGORY_COMBO_API),
            requestApi<Province[]>('get', PROVINCE_COMBO_API),
            requestApi<District[]>('get', DISTRICT_COMBO_API, {
                provinceCode: news?.province,
            }),
            requestApi<Ward[]>('get', WARD_COMBO_API, {
                districtCode: news?.district,
            }),
            requestApi<ComboOption[]>('get', PRODUCT_TYPE_COMBO_API, {
                categoryId: news?.categoryId,
            }),
        ])
            .then(([resCategory, resProvince, resDistrict, resWard, resProdType]) => {
                if (resCategory.data?.success) setState({ categories: resCategory.data?.result });
                if (resProvince.data?.success)
                    setState({
                        provinces: resProvince.data?.result?.map(
                            x => ({ value: x.code, label: x.name } as ComboOption),
                        ),
                    });
                if (resDistrict.data?.success)
                    setState({
                        districts: resDistrict.data?.result?.map(
                            x => ({ value: x.code, label: x.name } as ComboOption),
                        ),
                    });
                if (resWard.data?.success)
                    setState({
                        wards: resWard.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)),
                    });

                if (resProdType.data?.success)
                    setState({
                        productTypes: resProdType.data?.result,
                    });
            })
            .catch(err => NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.SERVER_ERROR))
            .finally(() => setState({ loading: false }));
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await FileUtil.getBase64(file.originFileObj as RcFile);
        }

        modalRef?.current?.onOpen(
            <img alt="example" style={{ width: '100%' }} src={file.url || (file.preview as string)} />,
            'Xem trước',
            '50%',
            faImage,
        );
    };

    const handleChange: UploadProps['onChange'] = ({ fileList, file }) => {
        if (file.status === 'done') {
            const fileUrl = _.get(file.response, 'result');
            const newImageUrl = [...state.imageUrls, fileUrl];
            setState({ imageUrls: newImageUrl });
        }
        setState({ imageList: fileList });
    };
    const handleCancel = () => modalRef.current?.onClose();

    const onRemove = (file: UploadFile) => {
        const fileUrl = file.url ? file.url : _.get(file.response, 'result');
        const newImageUrls = state.imageUrls.filter(url => url !== fileUrl);
        setState({ imageUrls: newImageUrls });
    };

    const onChangePlacement = async (value: Identifier, key: Placement) => {
        const placementUrls: Record<
            Placement,
            { url: string; params?: Record<string, any>; opt: string; resetFieldsName?: string[] }
        > = {
            [Placement.Province]: {
                url: DISTRICT_COMBO_API,
                params: {
                    provinceCode: value,
                },
                opt: 'districts',
                resetFieldsName: [nameof.full<NewsRequest>(x => x.district), nameof.full<NewsRequest>(x => x.ward)],
            },
            [Placement.District]: {
                url: WARD_COMBO_API,
                params: {
                    districtCode: value,
                },
                opt: 'wards',
                resetFieldsName: [nameof.full<NewsRequest>(x => x.ward)],
            },
            [Placement.Ward]: {
                url: '',
                opt: '',
            },
        };

        const placementUrl = placementUrls[key];
        const response = await requestApi<BasePlacement[]>('get', placementUrl.url, placementUrl.params);
        if (response.data.success) {
            formRef.current?.resetFields(placementUrl.resetFieldsName);
            setState({
                [placementUrl.opt]: response.data.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)),
            });
            return;
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    if (!authUser?.user.phoneNumber)
        return (
            <BoxContainer>
                Vui lòng nhấn{' '}
                <Link
                    className="text-[#4a90e2] hover:text-[#4a90e2] hover:underline"
                    to={`/user/info/${authUser?.user?.id}`}
                >
                    vào đây
                </Link>{' '}
                để cập nhật thông tin trước khi thực hiện chức năng này!
            </BoxContainer>
        );

    if (isLoading) return <Loading />;
    if (isEditView) {
        if (!isOnSell || !news) return <Empty description="Xin lỗi, tin này đã ẩn hoặc không tồn tại!" />;
        if (!isOwnNews) return <Forbidden />;
    }
    return (
        <BoxContainer className="flex">
            {state.loading ? (
                <Loading />
            ) : (
                <>
                    <div className="w-1/3">
                        <div className="mb-2">
                            <div className="font-bold text-base text-[#222]">Ảnh về sản phẩm</div>
                            <div className="text-sm text-[#777]">Tải lên từ 1 - {numberImageCanUpload} ảnh</div>
                            <div className="text-sm text-[#777] italic">Ảnh đầu tiên là ảnh bìa của sản phẩm</div>
                            <div className="text-sm text-[#777]">
                                Xem thêm về{' '}
                                <Link to="" className="text-[#4a90e2] hover:text-[#4a90e2] hover:underline">
                                    Quy định đăng tin
                                </Link>{' '}
                            </div>
                        </div>
                        <Upload
                            name="image"
                            action={UPLOAD_FILE_API}
                            accept="image/*"
                            listType="picture-card"
                            fileList={state.imageList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            onRemove={onRemove}
                            method="post"
                        >
                            {state.imageList.length >= numberImageCanUpload ? null : uploadButton}
                        </Upload>
                    </div>
                    <BaseForm
                        className="w-2/3"
                        initialValues={
                            // !isEditView
                            //     ? ({
                            //           province: authUser?.user.province,
                            //           district: authUser?.user.district,
                            //           ward: authUser?.user.ward,
                            //       } as AppUser)
                            //     :
                            news
                        }
                        ref={formRef}
                        baseFormItem={[
                            {
                                children: <span className="font-bold text-base">Thông tin chi tiết</span>,
                            },
                            {
                                label: 'Danh mục đăng tin',
                                name: nameof.full<NewsRequest>(x => x.categoryId),
                                children: (
                                    <Select
                                        options={state.categories}
                                        placeholder="Chọn danh mục ..."
                                        onChange={async val => {
                                            const response = await requestApi<ComboOption[]>(
                                                'get',
                                                PRODUCT_TYPE_COMBO_API,
                                                {},
                                                { params: { categoryId: val } },
                                            );

                                            if (response.data.success) {
                                                formRef.current?.resetFields([
                                                    nameof.full<NewsRequest>(x => x.productTypeId),
                                                ]);
                                                setState({
                                                    productTypes: response.data.result,
                                                });
                                                return;
                                            }

                                            NotifyUtil.error(
                                                NotificationConstant.TITLE,
                                                response.data.message ?? NotificationConstant.SERVER_ERROR,
                                            );
                                        }}
                                    />
                                ),
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Loại sản phẩm',
                                name: nameof.full<NewsRequest>(x => x.productTypeId),
                                children: (
                                    <Select
                                        allowClear
                                        options={state.productTypes}
                                        placeholder="Chọn loại sản phẩm ..."
                                    />
                                ),
                                // rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Tiêu đề',
                                name: nameof.full<NewsRequest>(x => x.title),
                                children: <Input placeholder="Nhập tiêu đề ..." />,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Giá',
                                name: nameof.full<NewsRequest>(x => x.price),
                                children: (
                                    <Input
                                        suffix={<div>VND</div>}
                                        type="number"
                                        min={0}
                                        max={100000000} //100 trieu dong
                                        placeholder="Nhập giá ..."
                                        onChange={e =>
                                            setState({
                                                price: Number(e.target.value),
                                            })
                                        }
                                    />
                                ),
                                extra: `${
                                    state.price === 0
                                        ? LocaleUtil.numberToText(news?.price ?? 0)
                                        : LocaleUtil.numberToText(state.price)
                                } đồng`,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Mô tả chi tiết',
                                extra: `${
                                    state.descriptionCharacter === 0
                                        ? Number(news?.description.length ?? 0)
                                        : state.descriptionCharacter
                                }/1500 ký tự`,
                                name: nameof.full<NewsRequest>(x => x.description),
                                children: (
                                    <TextArea
                                        rows={8}
                                        placeholder="- Sản phẩm: tên, số lượng, thương hiệu, xuất xứ
                                            - Hạn sử dụng, cách bảo quản
                                            - Giấy chứng nhận (nếu có)
                                            Đối với nhà hàng, quán ăn:
                                            - Giờ mở cửa, đóng cửa
                                            - Dịch vụ giao hàng, thanh toán (nếu có)
                                            Chấp nhận thanh toán/ vận chuyển qua Chợ Đồ Si
                                        "
                                        onChange={e =>
                                            setState({
                                                descriptionCharacter: e.target.value.length,
                                            })
                                        }
                                    />
                                ),
                                rules: [
                                    { required: true, message: NotificationConstant.NOT_EMPTY },
                                    { max: 1500, message: 'Tối đa 1500 ký tự' },
                                ],
                            },
                            {
                                children: <span className="font-bold text-base">Nơi bán sản phẩm</span>,
                            },
                            {
                                label: 'Tỉnh/TP',
                                name: nameof.full<NewsRequest>(x => x.province),
                                children: (
                                    <Select
                                        options={state.provinces}
                                        placeholder="Chọn Tỉnh/TP ..."
                                        showSearch
                                        filterOption={(input, option) =>
                                            LocaleUtil.includesWithoutLocate(option?.label ?? '', input)
                                        }
                                        onChange={val => onChangePlacement(val, Placement.Province)}
                                    />
                                ),
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Quận/Huyện',
                                name: nameof.full<NewsRequest>(x => x.district),
                                children: (
                                    <Select
                                        options={state.districts}
                                        placeholder="Chọn Quận/huyện ..."
                                        showSearch
                                        filterOption={(input, option) =>
                                            LocaleUtil.includesWithoutLocate(option?.label ?? '', input)
                                        }
                                        onChange={val => onChangePlacement(val, Placement.District)}
                                    />
                                ),
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Phường/Xã',
                                name: nameof.full<NewsRequest>(x => x.ward),
                                children: (
                                    <Select
                                        showSearch
                                        options={state.wards}
                                        placeholder="Chọn Phường/xã ..."
                                        filterOption={(input, option) =>
                                            LocaleUtil.includesWithoutLocate(option?.label ?? '', input)
                                        }
                                    />
                                ),
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Địa chỉ cụ thể',
                                name: nameof.full<NewsRequest>(x => x.address),
                                children: <Input placeholder="Nhập địa chỉ cụ thể ..." />,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                                extra: 'Điền thôn/ số nhà, tên đường',
                            },
                        ]}
                        layout="vertical"
                        labelCol={0}
                        renderBtnBottom={() => {
                            return (
                                // <div className="flex items-center justify-center w-full">
                                //     <ButtonBase title="Đăng tin" startIcon={faSave}  size="md" />
                                // </div>
                                <div className="w-full flex justify-center">
                                    <div
                                        className={clsx(
                                            'border border-[#f80] bg-[#f80] text-base uppercase py-2.5 px-5',
                                            'w-1/2 text-white rounded select-none cursor-pointer hover:bg-opacity-90',
                                            'flex justify-center items-center',
                                        )}
                                        onClick={onSave}
                                    >
                                        {!isEditView ? 'Đăng tin' : 'Lưu chỉnh sửa'}
                                    </div>
                                </div>
                            );
                        }}
                    />
                    <ModalBase
                        ref={modalRef}
                        footer={[
                            <div key="close" className="w-full flex items-center justify-center">
                                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={handleCancel} />
                            </div>,
                        ]}
                    />
                </>
            )}
        </BoxContainer>
    );
};

export default NewsView;
