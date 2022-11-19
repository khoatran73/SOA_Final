import { UploadOutlined } from '@ant-design/icons';
import { faClose, faImage, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input, Select, Upload } from 'antd';
import { RcFile, UploadFile, UploadProps } from 'antd/lib/upload';
import { Method } from 'axios';
import _ from 'lodash';
import React, { useRef } from 'react';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '~/component/Form/BaseForm';
import { AppModalContainer } from '~/component/Layout/AppModalContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { UPLOAD_FILE_API } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { useMergeState } from '~/hook/useMergeState';
import { requestApi } from '~/lib/axios';
import { Category, SellTypeOptions } from '~/types/product/Category';
import FileUtil from '~/util/FileUtil';
import NotifyUtil from '~/util/NotifyUtil';
import { CATEGORY_CREATE_API, CATEGORY_UPDATE_API } from '../api/api';

interface Props {
    initialValues?: Partial<Category>;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

type State = {
    // imageList: UploadFile[];
    imageUrl: string;
};

const CategoryForm: React.FC<Props> = props => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const [state, setState] = useMergeState<State>({
        // imageList:
        //     props.initialValues?.imageUrls?.map(
        //         url =>
        //             ({
        //                 uid: url,
        //                 name: url,
        //                 url: url,
        //                 thumbUrl: url,
        //             } as UploadFile),
        //     ) ?? [],
        imageUrl: props.initialValues?.imageUrl ?? '',
    });

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
                url: CATEGORY_CREATE_API,
                method: 'post',
                message: NotificationConstant.DESCRIPTION_CREATE_SUCCESS,
            },
            update: {
                url: `${CATEGORY_UPDATE_API}/${props.initialValues?.id}`,
                method: 'put',
                message: NotificationConstant.DESCRIPTION_UPDATE_SUCCESS,
            },
        };

        const urlParam = props.initialValues ? urlParams.update : urlParams.create;

        const response = await requestApi(urlParam.method, urlParam.url, {
            ...formValues,
            [nameof.full<Category>(x => x.imageUrl)]: state.imageUrl,
        });

        if (response.data?.success) {
            NotifyUtil.success(NotificationConstant.TITLE, urlParam.message);
            props?.onSubmitSuccessfully?.();
            props.onClose?.();
            return;
        }

        NotifyUtil.error(NotificationConstant.TITLE, response.data.message ?? NotificationConstant.SERVER_ERROR);
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
            setState({ imageUrl: _.get(file.response, 'result') });
        }
        // setState({ imageList: fileList });
    };
    const handleCancel = () => modalRef.current?.onClose();

    const onRemove = (file: UploadFile) => {
        const fileUrl = file.url ? file.url : _.get(file.response, 'result');
        setState({ imageUrl: fileUrl });
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    return (
        <AppModalContainer>
            <BaseForm
                initialValues={props.initialValues}
                ref={formRef}
                baseFormItem={[
                    {
                        label: 'Mã danh mục',
                        name: nameof.full<Category>(x => x.code),
                        children: <Input placeholder="Nhập mã danh mục ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Tên danh mục',
                        name: nameof.full<Category>(x => x.name),
                        children: <Input placeholder="Nhập tên danh mục ..." />,
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Kiểu bán',
                        name: nameof.full<Category>(x => x.type),
                        children: (
                            <Select
                                placeholder="Chọn kiểu bán ..."
                                // defaultValue={SellType.SellOnline}
                                options={SellTypeOptions}
                            />
                        ),
                        rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                    },
                    {
                        label: 'Hình ảnh',
                        name: nameof.full<Category>(x => x.imageUrl),
                        children: (
                            <>
                                <Upload
                                    name="image"
                                    action={UPLOAD_FILE_API}
                                    accept="image/*"
                                    listType="picture-card"
                                    showUploadList={false}
                                    // fileList={state.imageList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    onRemove={onRemove}
                                    method="post"
                                >
                                    {/* {state.imageList.length >= 8 ? null : uploadButton} */}
                                    {state.imageUrl ? <img src={state.imageUrl} /> : uploadButton}
                                </Upload>
                                <ModalBase
                                    ref={modalRef}
                                    footer={[
                                        <div key="close" className="w-full flex items-center justify-center">
                                            <ButtonBase
                                                title="Đóng"
                                                startIcon={faClose}
                                                variant="danger"
                                                onClick={handleCancel}
                                            />
                                        </div>,
                                    ]}
                                />
                            </>
                        ),
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
        </AppModalContainer>
    );
};

export default CategoryForm;
