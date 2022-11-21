import { faClose, faCog, faSave } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '~/AppStore';
import happyImage from '~/assets/layout/happy.jpg';
import { API_GET_OTP_USER, API_REGISTER_USER } from '~/configs';
import NotificationConstant from '~/configs/contants';
import { requestApi } from '~/lib/axios';
import { RegisterParam } from '~/types/ums/AuthUser';
import NotifyUtil from '~/util/NotifyUtil';
import { ButtonBase } from '../Elements/Button/ButtonBase';
import BaseForm, { BaseFormRef } from '../Form/BaseForm';
import ModalBase, { ModalRef } from '../Modal/ModalBase';
import { AppModalContainer } from './AppModalContainer';

const RegisterView: React.FC = () => {
    const formRef = useRef<BaseFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const { isAuthenticated } = useSelector((state: RootState) => state.authData);

    const onRegister = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const registerParams = formRef.current?.getFieldsValue() as RegisterParam;
        const password = registerParams.password;
        const confirmPassword = registerParams.passwordCF;
        if (password !== confirmPassword) {
            NotifyUtil.error(NotificationConstant.TITLE, 'Mật khẩu không trùng khớp');
            return;
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

    if (!!isAuthenticated) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="w-full h-screen relative flex items-center justify-center">
            <div className="w-[380px] min-h-[350px] bg-white rounded-md shadow p-3 pt-0 flex flex-col">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-[#ffba00] font-bold text-xl">Đăng ký</div>
                        <div className="text-[#9b9b9b] font-md">Tạo tài khoản ngay</div>
                    </div>
                    <div>
                        <img src={happyImage} width={200} alt="" />
                    </div>
                </div>
                <BaseForm
                    ref={formRef}
                    baseFormItem={[
                        {
                            name: nameof.full<RegisterParam>(x => x.emailAddress),
                            children: <Input placeholder="Nhập địa chỉ email..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            name: nameof.full<RegisterParam>(x => x.username),
                            children: <Input placeholder="Nhập tài khoản..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            name: nameof.full<RegisterParam>(x => x.password),
                            children: <Input.Password placeholder="Nhập mật khẩu..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            name: nameof.full<RegisterParam>(x => x.passwordCF),
                            children: <Input.Password placeholder="Nhập lại mật khẩu..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                    ]}
                    labelAlign="left"
                    labelCol={0}
                    className={'w-full flex items-center justify-center flex-col'}
                    width={'100%'}
                    renderBtnBottom={() => {
                        return (
                            <div className="w-full">
                                <div
                                    className="w-full h-10 rounded bg-[#fe9900] cursor-pointer flex items-center justify-center text-white text-base uppercase"
                                    onClick={() => onRegister()}
                                >
                                    Đăng ký
                                </div>
                                <div className="w-full text-center mt-2 text-xs">
                                    Bằng việc Đăng ký, bạn đã đồng ý với{' '}
                                    <a
                                        href="/forgot-password"
                                        className="text-[#38699f] hover:text-[#38699f] hover:underline "
                                    >
                                        Điều khoản sử dụng
                                    </a>{' '}
                                    của Chợ Đồ Si
                                </div>
                                <div className="text-xs text-center">
                                    Bạn đã có tài khoản?{' '}
                                    <a
                                        href="/login"
                                        className="text-[#38699f] hover:text-[#38699f] hover:underline text-xs"
                                    >
                                        Đăng nhập
                                    </a>
                                </div>
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
    const { initialValues } = props;
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
        };
        requestApi('post', API_REGISTER_USER, data).then(res => {
            if (res.data.success) {
                NotifyUtil.success(NotificationConstant.TITLE, 'Đăng kí tài khoản thành công');
                props.onSubmitSuccessfully?.();
            } else {
                NotifyUtil.error(NotificationConstant.TITLE, res.data.message ?? '');
            }
        });
    };
    const onResentOtp = async () => {
        requestApi('post', API_GET_OTP_USER, initialValues).then(res => {
            if (res.data.success) {
                setCounter(60);
                NotifyUtil.success(NotificationConstant.TITLE, 'Gửi lại mã thành công!');
            }
        });
    };
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
    );
};
