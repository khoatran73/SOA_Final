import BaseForm, { BaseFormRef } from '../Form/BaseForm';
import bgImageUrl from '~/assets/login/background_login.png';
import { useEffect, useRef, useState } from 'react';
import { ButtonBase } from '../Elements/Button/ButtonBase';
import { Input } from 'antd';
import { RegisterParam } from '~/types/ums/AuthUser';
import {  API_GET_OTP_USER, API_REGISTER_USER } from '~/configs';
import { requestApi } from '~/lib/axios';
import { useNavigate } from 'react-router-dom';
import NotifyUtil from '~/util/NotifyUtil';
import NotificationConstant from '~/configs/contants';
import { AppModalContainer } from './AppModalContainer';
import { faClose, faCog, faSave } from '@fortawesome/free-solid-svg-icons';
import ModalBase, { ModalRef } from '../Modal/ModalBase';

const RegisterView: React.FC = () => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const onRegister = () => {
        const registerParams = formRef.current?.getFieldsValue() as RegisterParam;
        const password = registerParams.password
        const confirmPassword = registerParams.passwordCF
        if (password !== confirmPassword) {
            NotifyUtil.error(NotificationConstant.TITLE, 'Mật khẩu không trùng khớp');
            return
        }
            
        requestApi('post', API_GET_OTP_USER, registerParams).then(res => {
            if (res.data.success) {
                modalRef.current?.onOpen(
                    <ModalRegister
                        onSubmitSuccessfully={() => {
                            modalRef.current?.onClose();
                            window.location.href = '/login';
                        }}
                        onClose={modalRef.current?.onClose}
                        initialValues={registerParams}
                    />,
                    'Nhập mã OTP',
                    '60%',
                );
            }
        });
    };
    return (
        <div className="w-full h-screen relative flex items-center justify-center">
            <img src={bgImageUrl} className="w-full h-full absolute top-0 left-0 -z-10" alt="" />
            <div className="w-[600px] h-auto bg-white rounded-md shadow p-3">
                <BaseForm
                    ref={formRef}
                    baseFormItem={[
                        {
                            label: 'Địa chỉ Email',
                            name: nameof.full<RegisterParam>(x => x.emailAddress),
                            children: <Input />,
                            rules: [{ required: true }],
                        },
                        {
                            label: 'Tài khoản',
                            name: nameof.full<RegisterParam>(x => x.username),
                            children: <Input />,
                            rules: [{ required: true }],
                        },
                        {
                            label: 'Mật khẩu',
                            name: nameof.full<RegisterParam>(x => x.password),
                            children: <Input.Password />,
                            rules: [{ required: true }],
                        },
                        {
                            label: 'Nhập lại mật khẩu',
                            name: nameof.full<RegisterParam>(x => x.passwordCF),
                            children: <Input.Password />,
                            rules: [{ required: true }],
                        },
                    ]}
                    labelAlign="left"
                    labelCol={6}
                    className={'w-full flex items-center justify-center flex-col'}
                    width={'100%'}
                    renderBtnBottom={() => {
                        return (
                            <div className="flex items-center justify-center w-full">
                                <ButtonBase title="Đăng kí" size="md" onClick={onRegister} />
                            </div>
                        );
                    }}
                />
            </div>
            <ModalBase ref={modalRef} />
        </div>
    );
};

export default RegisterView;

interface Props {
    initialValues?: any;
    onClose?: () => void;
    onSubmitSuccessfully?: () => void;
}

const ModalRegister: React.FC<Props> = (props: Props) => {
    const formRef = useRef<BaseFormRef>(null);
    const [counter, setCounter] = useState(60);
    const {initialValues} = props;
    useEffect(() => {
        const timerId = setInterval(() => {
            counter > 0 && setCounter(pre => pre - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [counter]);
    const onSend = () => {
        const data = {
            ...initialValues,
            otpCode: formRef.current?.getFieldsValue().otpCode,
        }
        requestApi('post', API_REGISTER_USER, data).then(res => {
            if (res.data.success) {
                NotifyUtil.success(NotificationConstant.TITLE, 'Đăng kí tài khoản thành công');
                props.onSubmitSuccessfully?.();
            }else{
                NotifyUtil.error(NotificationConstant.TITLE, res.data.message ?? '');
            }
        });
    }
    const onResentOtp = async() => {
        requestApi('post', API_GET_OTP_USER, initialValues).then(res => {
            if (res.data.success) {
                setCounter(60);
                NotifyUtil.success(NotificationConstant.TITLE, 'Gửi lại mã thành công!');
            }
        })
    }
    return (
        <AppModalContainer>
            <BaseForm
                ref={formRef}
                baseFormItem={[
                    {
                        label: `Nhập mã OTP ( ${counter}s )`,
                        name: 'otpCode',
                        children: <Input />,
                        rules: [{ required: true, message: 'Vui lòng nhập mã OTP' }],
                    },
                ]}
                labelAlign="left"
                className={'w-full flex items-center justify-center flex-col'}
                width={'100%'}
                labelCol={5}
                renderBtnBottom={() => {
                    return (
                        <>
                            {counter == 0 && (
                                <div className="flex items-center justify-start w-full">
                                    <ButtonBase title="Gửi lại mã" startIcon={faCog} onClick={onResentOtp} />
                                </div>
                            )}
                            <div className="flex items-center justify-center w-full">
                                <ButtonBase title="Xác nhận" startIcon={faSave} onClick={onSend} />
                                <ButtonBase title="Đóng" startIcon={faClose} variant="danger" onClick={props.onClose} />
                            </div>
                        </>
                    );
                }}
            />
        </AppModalContainer>
    )
}