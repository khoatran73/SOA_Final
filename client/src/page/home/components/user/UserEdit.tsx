import { UploadOutlined } from '@ant-design/icons';
import { faClose, faImage, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input, Select, Upload, UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/lib/upload';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Loading from '~/component/Elements/loading/Loading';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { API_UPDATE_USER, DISTRICT_COMBO_API, PROVINCE_COMBO_API, UPLOAD_FILE_API, WARD_COMBO_API } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { ComboOption, Identifier } from '~/types/shared';
import { BasePlacement, District, Placement, Province, Ward } from '~/types/shared/Placement';
import { AppUser, User } from '~/types/ums/AuthUser';
import FileUtil from '~/util/FileUtil';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';

interface Props {
    user?: User;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

interface States {
    provinces: ComboOption[];
    districts: ComboOption[];
    wards: ComboOption[];
    loading: boolean;
    avatar: string;
}
const UserEdit: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const onSubmit = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const formValues = formRef.current?.getFieldsValue();
        const body = { ...formValues, avatar: state.avatar };

        const response = await requestApi('put', API_UPDATE_USER + '/' + props.user?.id, body);

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_UPDATE_SUCCESS);
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
    };

    const [state, setState] = useMergeState<States>({
        provinces: [],
        districts: [],
        wards: [],
        loading: false,
        avatar: props.user?.avatar || '',
    });

    useEffect(() => {
        (async () => {
            setState({ loading: true });
            const [reqProvince, reqDistrict, reqWard] = await Promise.all([
                requestApi<Province[]>('get', PROVINCE_COMBO_API),
                requestApi<District[]>('get', DISTRICT_COMBO_API, {
                    provinceCode: props.user?.province,
                }),
                requestApi<Ward[]>('get', WARD_COMBO_API, {
                    districtCode: props.user?.district,
                }),
            ]);

            setState({
                provinces: reqProvince?.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)) || [],
                districts: reqDistrict?.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)) || [],
                wards: reqWard?.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)) || [],
                loading: false,
            });
        })();
    }, [props.user?.district, props.user?.province]);

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
                resetFieldsName: [nameof.full<User>(x => x.district), nameof.full<User>(x => x.ward)],
            },
            [Placement.District]: {
                url: WARD_COMBO_API,
                params: {
                    districtCode: value,
                },
                opt: 'wards',
                resetFieldsName: [nameof.full<User>(x => x.ward)],
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

    const handleChange: UploadProps['onChange'] = ({ fileList, file }) => {
        if (file.status === 'done') {
            setState({ avatar: _.get(file.response, 'result') });
        }
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

    const onRemove = (file: UploadFile) => {
        const fileUrl = file.url ? file.url : _.get(file.response, 'result');
        setState({ avatar: fileUrl });
    };

    const handleCancel = () => modalRef.current?.onClose();

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    if (state.loading) return <Loading />;
    return (
        <AppModalContainer>
            <div className="flex">
                <div className="w-[20%]">
                    <Upload
                        name="image"
                        action={UPLOAD_FILE_API}
                        accept="image/*"
                        listType="picture-card"
                        onPreview={handlePreview}
                        onChange={handleChange}
                        onRemove={onRemove}
                        method="post"
                    >
                        {state.avatar ? (
                            <img src={state.avatar} width={80} height={80} className="object-cover" />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </div>
                <div className="w-[80%]">
                    <BaseForm
                        initialValues={
                            {
                                fullName: props.user?.fullName,
                                phoneNumber: props.user?.phoneNumber,
                                province: props.user?.province,
                                district: props.user?.district,
                                ward: props.user?.ward,
                                address: props.user?.address,
                            } as AppUser
                        }
                        ref={formRef}
                        baseFormItem={[
                            {
                                label: 'Họ tên',
                                name: nameof.full<AppUser>(x => x.fullName),
                                children: <Input placeholder="Nhập họ tên..." />,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                            {
                                label: 'Số điện thoại',
                                name: nameof.full<AppUser>(x => x.phoneNumber),
                                children: <Input placeholder="Nhập số điện thoại ..." />,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
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
                            {
                                label: 'Địa chỉ cụ thể',
                                name: nameof.full<AppUser>(x => x.address),
                                children: <Input placeholder="Nhập địa chỉ cụ thể ..." />,
                                rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                            },
                        ]}
                        labelAlign="left"
                        labelCol={4}
                    />
                </div>
            </div>
            <div className="flex items-center justify-center w-full">
                <ButtonBase title="Lưu" startIcon={faSave} onClick={onSubmit} />
                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
            </div>
            <ModalBase
                ref={modalRef}
                footer={[
                    <div key="close" className="w-full flex items-center justify-center">
                        <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={handleCancel} />
                    </div>,
                ]}
            />
        </AppModalContainer>
    );
};

export default UserEdit;
