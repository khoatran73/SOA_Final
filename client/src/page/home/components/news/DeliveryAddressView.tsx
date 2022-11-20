import { faClose, faEdit, faLocationPin, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, Input, Select } from 'antd';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { DISTRICT_COMBO_API, PROVINCE_COMBO_API, UPDATE_DELIVERY_ADDRESS_API, WARD_COMBO_API } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { fetchAuthDataAsync } from '~/store/authSlice';
import { ComboOption, Identifier } from '~/types/shared';
import { BasePlacement, District, Placement, Province, Ward } from '~/types/shared/Placement';
import { AppUser, DeliveryAddress } from '~/types/ums/AuthUser';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';

interface Props {
    onClose?: () => void;
    user?: AppUser;
    deliveryAddress?: DeliveryAddress;
    setDeliveryAddress: React.Dispatch<React.SetStateAction<DeliveryAddress | undefined>>;
}

interface ItemProps {
    delAddress: DeliveryAddress;
    handleChangeAddress: (delAddress?: DeliveryAddress) => void;
    isChoice: boolean;
    setChoiceAddress: React.Dispatch<React.SetStateAction<DeliveryAddress | undefined>>;
}

const Item = (props: ItemProps) => {
    const { delAddress, handleChangeAddress, isChoice, setChoiceAddress } = props;
    return (
        <div className="flex pb-2 mb-2 border-b border-[#dbdbdb] cursor-default">
            <div
                className={clsx('w-5 h-5 bg-[#f4f4f4] rounded-full relative cursor-pointer')}
                style={{
                    background: !isChoice ? '#f4f4f4' : '#ffba00',
                }}
                onClick={() => setChoiceAddress(delAddress)}
            />
            <div className="w-full ml-2">
                <div className="flex w-full justify-between items-center">
                    <div className="flex">
                        <div className="font-bold mr-2">{delAddress.name}</div>
                        <div>{delAddress.phone}</div>
                    </div>
                    <BaseIcon
                        icon={faEdit}
                        className="cursor-pointer"
                        onClick={() => handleChangeAddress(delAddress)}
                    />
                </div>
                <div>
                    {delAddress.address}, {delAddress.wardName}, {delAddress.districtName}, {delAddress.provinceName}
                </div>
            </div>
        </div>
    );
};

interface DeliveryAddressFormProps {
    onClose?: () => void;
    delAddress?: DeliveryAddress;
    userId?: string;
}

const DeliveryAddressForm = (props: DeliveryAddressFormProps) => {
    const { delAddress, onClose, userId } = props;
    const formRef = useRef<BaseFormRef>(null);
    const dispatch = useDispatch();

    const [state, setState] = useMergeState<{
        provinces: ComboOption[];
        districts: ComboOption[];
        wards: ComboOption[];
        loading: boolean;
    }>({
        provinces: [],
        districts: [],
        wards: [],
        loading: false,
    });

    useEffect(() => {
        (async () => {
            setState({ loading: true });
            const [reqProvince, reqDistrict, reqWard] = await Promise.all([
                requestApi<Province[]>('get', PROVINCE_COMBO_API),
                requestApi<District[]>('get', DISTRICT_COMBO_API, {
                    provinceCode: delAddress?.province,
                }),
                requestApi<Ward[]>('get', WARD_COMBO_API, {
                    districtCode: delAddress?.district,
                }),
            ]);

            setState({
                provinces: reqProvince?.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)) || [],
                districts: reqDistrict?.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)) || [],
                wards: reqWard?.data?.result?.map(x => ({ value: x.code, label: x.name } as ComboOption)) || [],
                loading: false,
            });
        })();
    }, [delAddress?.district, delAddress?.province]);

    const onSubmit = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();
        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const formValues = formRef.current?.getFieldsValue();
        const response = await requestApi('put', UPDATE_DELIVERY_ADDRESS_API + '/' + userId, {
            ...formValues,
        });
        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, NotificationConstant.DESCRIPTION_UPDATE_SUCCESS);
            dispatch(fetchAuthDataAsync());
            onClose?.();
            return;
        }
        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
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
                resetFieldsName: [
                    nameof.full<DeliveryAddress>(x => x.district),
                    nameof.full<DeliveryAddress>(x => x.ward),
                ],
            },
            [Placement.District]: {
                url: WARD_COMBO_API,
                params: {
                    districtCode: value,
                },
                opt: 'wards',
                resetFieldsName: [nameof.full<DeliveryAddress>(x => x.ward)],
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

    return (
        <AppModalContainer style={{ padding: 0 }}>
            <BaseForm
                initialValues={delAddress}
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'Tên người nhận',
                        name: nameof.full<DeliveryAddress>(x => x.name),
                        children: <Input placeholder="Nhập tên người nhận ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Số điện thoại',
                        name: nameof.full<DeliveryAddress>(x => x.phone),
                        children: <Input placeholder="Nhập sđt ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Tỉnh/TP',
                        name: nameof.full<DeliveryAddress>(x => x.province),
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
                        name: nameof.full<DeliveryAddress>(x => x.district),
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
                        name: nameof.full<DeliveryAddress>(x => x.ward),
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
                        name: nameof.full<DeliveryAddress>(x => x.address),
                        children: <Input placeholder="Nhập địa chỉ cụ thể ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        extra: 'Điền thôn/ số nhà, tên đường',
                    },
                    {
                        label: 'Đặt làm mặc định',
                        name: nameof.full<DeliveryAddress>(x => x.isDefault),
                        children: <Checkbox />,
                        initialValue: true,
                        valuePropName: 'checked',
                    },
                ]}
                labelAlign="left"
                labelCol={6}
                renderBtnBottom={() => {
                    return (
                        <div className="flex items-center justify-center w-full">
                            <ButtonBase title="Lưu" startIcon={faSave} onClick={onSubmit} />
                            <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                        </div>
                    );
                }}
            />
        </AppModalContainer>
    );
};

const DeliveryAddressView: React.FC<Props> = props => {
    const modalRef = useRef<ModalRef>(null);

    const [choiceAddress, setChoiceAddress] = useState<DeliveryAddress | undefined>(props.deliveryAddress);

    const handleChangeAddress = (delAddress?: DeliveryAddress) => {
        modalRef.current?.onOpen(
            <DeliveryAddressForm delAddress={delAddress} onClose={modalRef.current?.onClose} userId={props.user?.id} />,
            'Địa chỉ nhận hàng',
            '35%',
            faLocationPin,
        );
    };

    return (
        <AppModalContainer style={{ padding: 0 }}>
            <div>
                {props.user?.deliveryAddress?.map(delAddress => {
                    return (
                        <div key={delAddress.id}>
                            <Item
                                delAddress={delAddress}
                                isChoice={choiceAddress?.id === delAddress.id}
                                handleChangeAddress={handleChangeAddress}
                                setChoiceAddress={setChoiceAddress}
                            />
                        </div>
                    );
                })}
                <div
                    onClick={() => handleChangeAddress()}
                    className="w-full h-10 cursor-pointer rounded border border-[#ffba00] text-[#ffba00] flex items-center justify-center"
                >
                    <BaseIcon icon={faPlus} className="mr-1" />
                    Thêm địa chỉ nhận hàng mới
                </div>
                <div key="close" className="mt-3 w-full flex items-center justify-center">
                    <ButtonBase
                        title="Chọn"
                        startIcon={faSave}
                        variant="warning"
                        onClick={() => {
                            props?.setDeliveryAddress?.(choiceAddress)
                            props.onClose?.();
                        }}
                    />
                    <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                </div>
            </div>
            <ModalBase ref={modalRef} />
        </AppModalContainer>
    );
};

export default DeliveryAddressView;
