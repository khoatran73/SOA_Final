
import { faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import React, {  useRef } from 'react';
import Loading from '~/component/Elements/loading/Loading';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { baseDeleteApi } from '~/lib/axios';
import { AppUser, User } from '~/types/ums/AuthUser';
import { DELETE_USER_BY_ID_API, USER_LIST_API } from './api/api';
import UserForm from './component/UserForm';

const UserListView: React.FC = () => {
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const gridController = useBaseGrid<User>({
        url: USER_LIST_API,
        gridRef: gridRef,
    });

    const onDetail = (dataRow: User) => {
        modalRef.current?.onOpen(
            <UserForm
                readonly={true}
                initialValues={dataRow}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới tài khoản',
            '80%',
            faAppleAlt,
        );
    };
    const onUpdate = (dataRow: User) => {
        modalRef.current?.onOpen(
            <UserForm
                readonly={false}
                initialValues={dataRow}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới tài khoản',
            '80%',
            faAppleAlt,
        );
    };
    const onCreate = () => {
        modalRef.current?.onOpen(
            <UserForm
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới tài khoản',
            '50%',
        );
    };

    const UserColDefs: BaseGridColDef[] = [
        {
            headerName: 'Tên người dùng',
            field: nameof.full<AppUser>(x => x.fullName),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Username',
            field: nameof.full<AppUser>(x => x.username),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Địa chỉ Email',
            field: nameof.full<AppUser>(x => x.email),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Số điện thoại',
            field: nameof.full<AppUser>(x => x.phoneNumber),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
        },
        {
            headerName: 'Vai trò',
            field: nameof.full<AppUser>(x => x.isSupper),
            minWidth: 200,
            flex: 1,
            cellStyle: { textAlign: 'center', fontWeight: '500' },
            cellRenderer: (data: any) => {
                return data.value ? 'Quản trị viên' : 'Người dùng';
            },
        },
    ];

    if (gridController?.loading) return <Loading />;
    return (
        <AppContainer>
            {gridController?.loading ? (
                <Loading />
            ) : (
                <>
                    <BaseGrid
                        columnDefs={UserColDefs}
                        data={gridController?.data}
                        ref={gridRef}
                        actionRowsList={{
                            hasEditBtn: true,
                            hasDeleteBtn: true,
                            hasDetailBtn: true,
                            onClickDetailBtn: onDetail,
                            onClickEditBtn: onUpdate,
                            onClickDeleteBtn(data) {
                                baseDeleteApi(DELETE_USER_BY_ID_API, data.id);
                                gridController?.reloadData();
                            },
                        }}
                        defaultColDef={{
                            autoHeight: true,
                        }}
                        actionRowsWidth={120}
                    >
                        <GridToolbar
                            hasCreateButton
                            hasRefreshButton
                            onClickCreateButton={onCreate}
                            onClickRefreshButton={() => gridController?.reloadData()}
                        />
                    </BaseGrid>
                    <ModalBase ref={modalRef} />
                </>
            )}
        </AppContainer>
    );
};

export default UserListView;
