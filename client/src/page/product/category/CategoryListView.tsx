import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Image } from 'antd';
import clsx from 'clsx';
import _ from 'lodash';
import React, { useRef } from 'react';
import Loading from '~/component/Elements/loading/Loading';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { baseDeleteApi } from '~/lib/axios';
import { Category, SellType } from '~/types/product/Category';
import { CATEGORY_DELETE_API, CATEGORY_INDEX_API } from './api/api';
import CategoryForm from './components/CategoryForm';

const CategoryListView: React.FC = () => {
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);

    const gridController = useBaseGrid<Category>({
        url: CATEGORY_INDEX_API,
        gridRef: gridRef,
    });

    const onCreate = () => {
        modalRef.current?.onOpen(
            <CategoryForm
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới danh mục',
            '50%',
        );
    };

    const onUpdate = (data: Category) => {
        modalRef.current?.onOpen(
            <CategoryForm
                initialValues={data}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Cập nhật danh mục',
            '50%',
            faEdit
        );
    };

    const CategoryColDefs: BaseGridColDef[] = [
        {
            headerName: 'Mã danh mục',
            field: nameof.full<Category>(x => x.code),
            minWidth: 200,
            cellStyle: {
                display: 'flex',
                alignItems: 'center',
            },
        },
        {
            headerName: 'Tên danh mục',
            field: nameof.full<Category>(x => x.name),
            minWidth: 450,
            cellStyle: {
                display: 'flex',
                alignItems: 'center',
            },
        },
        {
            headerName: 'Kiểu bán',
            field: nameof.full<Category>(x => x.type),
            minWidth: 200,
            cellStyle: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            cellRenderer: (params: any) => {
                const data = _.get(params, 'data') as Category;
                const type = data.type;

                if (type === SellType.SellOnline)
                    return (
                        <div
                            className={clsx(
                                'border border-[#589f39] rounded text-[#589f39]',
                                'flex items-center justify-center h-[35px] w-[130px]',
                            )}
                        >
                            Bán trực tuyến
                        </div>
                    );

                return <div
                className={clsx(
                    'border border-[#9b9b9b] rounded text-[#9b9b9b]',
                    'flex items-center justify-center h-[35px] w-[130px]',
                )}
            >
                Bán trực tiếp
            </div>
            },
        },
        {
            headerName: 'Hình ảnh',
            field: nameof.full<Category>(x => x.imageUrl),
            minWidth: 150,
            cellRenderer: (params: any) => {
                const data = _.get(params, 'data') as Category;
                const { imageUrl } = data;

                if (!imageUrl) return null;

                return (
                    <div className="w-full h-full flex items-center justify-center p-2">
                        <Image
                            width={50}
                            src={imageUrl}
                            alt=""
                            preview={false}
                            // preview={{
                            //     mask: <div><BaseIcon icon={faEye} /> Xem trước</div>,
                            // }}
                        />
                    </div>
                );
            },
        },
    ];

    const onDelete = (data: Category) => {
        baseDeleteApi(CATEGORY_DELETE_API, data.id);
        gridController?.reloadData();
    };

    return (
        <AppContainer>
            {gridController?.loading ? (
                <Loading />
            ) : (
                <>
                    <BaseGrid
                        columnDefs={CategoryColDefs}
                        data={gridController?.data}
                        ref={gridRef}
                        actionRowsList={{
                            hasEditBtn: true,
                            hasDeleteBtn: true,
                            onClickEditBtn: onUpdate,
                            onClickDeleteBtn: onDelete,
                        }}
                        defaultColDef={{
                            autoHeight: true,
                        }}
                        actionRowsWidth={100}
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

export default CategoryListView;
