import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input, Select } from 'antd';
import { Method } from 'axios';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { QueryConfig, ExtractFnReturnType } from '~/lib/react-query';
import { ProductType } from '~/types/product/ProductType';
import { ComboOption } from '~/types/shared';
import LocaleUtil from '~/util/LocaleUtil';
import NotifyUtil from '~/util/NotifyUtil';
import { PRODUCT_TYPE_CREATE_API, PRODUCT_TYPE_UPDATE_API } from '../api/api';
import { CATEGORY_COMBO_API } from './../../category/api/api';
import { useQuery } from 'react-query';
import Loading from '~/component/Elements/loading/Loading';

interface Props {
    initialValues?: Partial<ProductType>;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

// use query
const getCategoryCombo = async () => {
    return requestApi('get', CATEGORY_COMBO_API);
};

type QueryFnType = typeof getCategoryCombo;

type UseCategoryComboConfigType = QueryConfig<QueryFnType>;

const useCategoryCombo = (config?: UseCategoryComboConfigType) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        queryKey: ['GET_CATEGORY_COMBO'],
        queryFn: () => getCategoryCombo(),
        ...config,
    });
};
//

const ProductTypeForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const { data: categoryOpts, isLoading } = useCategoryCombo();

    const onSubmit = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const formValues = formRef.current?.getFieldsValue();

        const urlParams: Record<
            string,
            {
                url: string;
                method: Method;
                message: string;
            }
        > = {
            create: {
                url: PRODUCT_TYPE_CREATE_API,
                method: 'post',
                message: NotificationConstant.DESCRIPTION_CREATE_SUCCESS,
            },
            update: {
                url: `${PRODUCT_TYPE_UPDATE_API}/${props.initialValues?.id}`,
                method: 'put',
                message: NotificationConstant.DESCRIPTION_UPDATE_SUCCESS,
            },
        };

        const urlParam = props.initialValues ? urlParams.update : urlParams.create;

        const response = await requestApi(urlParam.method, urlParam.url, {
            ...formValues,
        });

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, urlParam.message);
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }
    };

    return (
        <AppModalContainer>
            {isLoading ? (
                <Loading />
            ) : (
                <BaseForm
                    initialValues={props.initialValues}
                    ref={formRef}
                    baseFormItem={[
                        {
                            label: 'Danh mục',
                            name: nameof.full<ProductType>(x => x.categoryId),
                            children: (
                                <Select
                                    options={categoryOpts?.data?.result as ComboOption[]}
                                    placeholder="Chọn Danh mục ..."
                                    showSearch
                                    filterOption={(input, option) =>
                                        LocaleUtil.includesWithoutLocate(option?.label ?? '', input)
                                    }
                                />
                            ),
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            label: 'Tên loại sản phẩm',
                            name: nameof.full<ProductType>(x => x.name),
                            children: <Input placeholder="Nhập tên danh mục ..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                    ]}
                    labelAlign="left"
                    labelCol={4}
                    renderBtnBottom={() => {
                        return (
                            <div className="flex items-center justify-center w-full">
                                <ButtonBase title="Lưu" startIcon={faSave} onClick={onSubmit} />
                                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                            </div>
                        );
                    }}
                />
            )}
        </AppModalContainer>
    );
};

export default ProductTypeForm;
