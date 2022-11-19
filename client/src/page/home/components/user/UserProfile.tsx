import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '~/AppStore';
import HomeBreadCrumb from '../../layout/HomeBreadCrumb';
import BoxContainer from './../../layout/BoxContainer';

const UserProfile: React.FC = () => {
    const { authUser } = useSelector((state: RootState) => state.authData);

    return (
        <>
            <HomeBreadCrumb
                className="pb-2 px-3 pt-0"
                style={{
                    margin: 0,
                }}
                item={[
                    {
                        title: 'Trang chủ',
                        link: '/',
                    },
                    {
                        title: 'Thông tin cá nhân',
                    },
                ]}
            />
            <BoxContainer>
                <div className="text-lg text-[#222] pb-3 mb-3 border-b border-[#eee] font-bold">Thông tin cá nhân</div>
                <div>
                    <div>lèt</div>
                    <div>right</div>
                </div>
            </BoxContainer>
        </>
    );
};

export default UserProfile;
