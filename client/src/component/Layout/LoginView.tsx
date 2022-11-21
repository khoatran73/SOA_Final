// @flow
import { Input } from 'antd';
import * as React from 'react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RootState } from '~/AppStore';
import happyImage from '~/assets/layout/happy.jpg';
import NotificationConstant from '~/configs/contants';
import { loginAsync } from '~/store/authSlice';
import { LoginParam } from '~/types/ums/AuthUser';
import NotifyUtil from '~/util/NotifyUtil';
import BaseForm, { BaseFormRef } from '../Form/BaseForm';

const LoginView: React.FC = () => {
    const formRef = useRef<BaseFormRef>(null);
    const { isAuthenticated } = useSelector((state: RootState) => state.authData);
    const dispatch = useDispatch();
    const onLogin = async () => {
        const isValidForm = await formRef.current?.isFieldsValidate();

        if (!isValidForm) {
            NotifyUtil.error(NotificationConstant.TITLE, NotificationConstant.ERROR_MESSAGE_UTIL);
            return;
        }

        const loginParams = formRef.current?.getFieldsValue() as LoginParam;
        dispatch(
            loginAsync(loginParams, () => {
                console.log('login-success!!');
            }),
        );
    };

    if (!!isAuthenticated) {
        return <Navigate to={'/'} />;
    }
    return (
        <div className="w-full h-screen relative flex items-center justify-center">
            <div className="w-[380px] min-h-[350px] bg-white rounded-md shadow p-3 pt-0 flex flex-col">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="text-[#ffba00] font-bold text-xl">Đăng nhập</div>
                        <div className="text-[#9b9b9b] font-md">Chào bạn quay lại</div>
                    </div>
                    <div>
                        <img src={happyImage} width={200} alt="" />
                    </div>
                </div>
                <BaseForm
                    ref={formRef}
                    baseFormItem={[
                        {
                            name: nameof.full<LoginParam>(x => x.username),
                            children: <Input placeholder="Nhập tài khoản..." />,
                            rules: [{ required: true, message: NotificationConstant.NOT_EMPTY }],
                        },
                        {
                            name: nameof.full<LoginParam>(x => x.password),
                            children: <Input.Password placeholder="Nhập mật khẩu..." />,
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
                                    onClick={() => onLogin()}
                                >
                                    Đăng nhập
                                </div>
                                <div className="w-full text-center mt-2">
                                    <a
                                        href="/forgot-password"
                                        className="text-[#38699f] hover:text-[#38699f] hover:underline text-xs"
                                    >
                                        Bạn quên mật khẩu?
                                    </a>
                                </div>
                                <div className="text-xs text-center">
                                    Chưa có tài khoản?{' '}
                                    <a
                                        href="/register"
                                        className="text-[#38699f] hover:text-[#38699f] hover:underline text-xs"
                                    >
                                        Đăng ký ngay
                                    </a>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default LoginView;
