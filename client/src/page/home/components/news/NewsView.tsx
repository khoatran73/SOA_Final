import { UploadOutlined } from '@ant-design/icons';
import { faClose, faImage, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input, Select, Upload, UploadFile } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RcFile, UploadProps } from 'antd/lib/upload';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '~/AppStore';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Loading from '~/component/Elements/loading/Loading';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { DISTRICT_COMBO_API, PROVINCE_COMBO_API, UPLOAD_FILE_API, WARD_COMBO_API } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { CATEGORY_COMBO_API } from '~/page/product/category/api/api';
import { ComboOption, Identifier } from '~/types/shared';
import { BasePlacement, District, Placement, Province, Ward } from '~/types/shared/Placement';
import { AppUser } from '~/types/ums/AuthUser';
import FileUtil from '~/util/FileUtil';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';
import { NEWS_CREATE_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';

interface NewsRequest {
    categoryId: Identifier;
    title: string;
    price: number;
    description: string;
}

interface State {
    //image
    imageList: UploadFile[];
    imageUrls: string[];
    //info:
    categories: ComboOption[];
    provinces: ComboOption[];
    districts: ComboOption[];
    wards: ComboOption[];
    loading: boolean;
    //descriptionCharacter
    descriptionCharacter: number;
}

const NewsView: React.FC = () => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const { authUser } = useSelector((state: RootState) => state.authData);
    const numberImageCanUpload = 5;
    const navigate = useNavigate();
    const [state, setState] = useMergeState<State>({
        imageList: [],
        imageUrls: [],
        categories: [],
        provinces: [],
        districts: [],
        wards: [],
        descriptionCharacter: 0,
        loading: true,
    });

    const onSave = async () => {
        formRef.current?.onSubmit();

        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const formValues = formRef.current?.getFieldsValue();
        const body = { ...formValues, imageUrls: state.imageUrls };

        const response = await requestApi('post', NEWS_CREATE_API, body);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_CREATE_SUCCESS);
            navigate('/news/dashboard')
            return;
        }
    };

    useEffect(() => {
        fetchComboOptions();
    }, []);

    const fetchComboOptions = () => {
        Promise.all([
            requestApi<ComboOption[]>('get', CATEGORY_COMBO_API),
            requestApi<Province[]>('get', PROVINCE_COMBO_API),
            requestApi<District[]>('get', DISTRICT_COMBO_API, {
                provinceCode: authUser?.user.province,
            }),
            requestApi<Ward[]>('get', WARD_COMBO_API, {
                districtCode: authUser?.user.district,
            }),
        ])
            .then(([resCategory, resProvince, resDistrict, resWard]) => {
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
            })
            .catch(err => console.log(err))
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
                resetFieldsName: [nameof.full<AppUser>(x => x.district), nameof.full<AppUser>(x => x.ward)],
            },
            [Placement.District]: {
                url: WARD_COMBO_API,
                params: {
                    districtCode: value,
                },
                opt: 'wards',
                resetFieldsName: [nameof.full<AppUser>(x => x.ward)],
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
        }
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    return (
        <BoxContainer className="flex">
            {state.loading ? (
                <Loading />
            ) : (
                <>
                    <div className="w-1/3">
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
                            {
                                province: authUser?.user.province,
                                district: authUser?.user.district,
                                ward: authUser?.user.ward,
                            } as AppUser
                        }
                        ref={formRef}
                        baseFormItem={[
                            {
                                children: <span className="font-bold text-base">Thông tin chi tiết</span>,
                            },
                            {
                                label: 'Danh mục đăng tin',
                                name: nameof.full<NewsRequest>(x => x.categoryId),
                                children: <Select options={state.categories} placeholder="Chọn danh mục ..." />,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
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
                                    <Input suffix={<div>VND</div>} min={0} type="number" placeholder="Nhập giá ..." />
                                ),
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Mô tả chi tiết',
                                extra: `${state.descriptionCharacter}/1500 ký tự`,
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
                                children: <span className="font-bold text-base">Về người bán</span>,
                            },
                            {
                                label: 'Tỉnh/TP',
                                name: nameof.full<AppUser>(x => x.province),
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
                                name: nameof.full<AppUser>(x => x.district),
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
                                name: nameof.full<AppUser>(x => x.ward),
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
                        ]}
                        layout="vertical"
                        labelCol={0}
                        renderBtnBottom={() => {
                            return (
                                <div className="flex items-center justify-center w-full">
                                    <ButtonBase title="Đăng tin" startIcon={faSave} onClick={onSave} size="md" />
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
