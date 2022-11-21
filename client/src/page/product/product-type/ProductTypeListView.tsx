import { Image } from 'antd';
import _ from 'lodash';
import React, { useMemo, useRef } from 'react';
import Loading from '~/component/Elements/loading/Loading';
import BaseGrid, { BaseGridColDef, BaseGridRef } from '~/component/Grid/BaseGrid';
import { GridToolbar } from '~/component/Grid/Components/GridToolbar';
import { AppContainer } from '~/component/Layout/AppContainer';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { useBaseGrid } from '~/hook/useBaseGrid';
import { baseDeleteApi } from '~/lib/axios';
import { ProductType } from '~/types/product/ProductType';
import { PRODUCT_TYPE_DELETE_API, PRODUCT_TYPE_INDEX_API } from './api/api';
import ProductTypeForm from './components/ProductTypeForm';
import { GetDataPath } from '@ag-grid-community/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const ProductTypeListView: React.FC = () => {
    const gridRef = useRef<BaseGridRef>(null);
    const modalRef = useRef<ModalRef>(null);

    const gridController = useBaseGrid<ProductType>({
        url: PRODUCT_TYPE_INDEX_API,
        gridRef: gridRef,
    });

    const onCreate = () => {
        modalRef.current?.onOpen(
            <ProductTypeForm
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Tạo mới loại sản phẩm',
            '50%',
        );
    };

    const onUpdate = (data: ProductType) => {
        modalRef.current?.onOpen(
            <ProductTypeForm
                initialValues={data}
                onSubmitSuccessfully={() => {
                    modalRef.current?.onClose();
                    gridController?.reloadData();
                }}
                onClose={modalRef.current?.onClose}
            />,
            'Cập nhật loại sản phẩm',
            '50%',
            faEdit,
        );
    };

    const ProductTypeColDefs: BaseGridColDef[] = [
        {
            headerName: 'Danh mục',
            field: nameof.full<ProductType>(x => x.categoryName),
            minWidth: 500,
            cellStyle: {
                display: 'flex',
                alignItems: 'center',
            },
            rowGroup: true,
        },
        {
            headerName: 'Tên loại sản phẩm',
            field: nameof.full<ProductType>(x => x.name),
            minWidth: 500,
        },
    ];

    const onDelete = (data: ProductType) => {
        baseDeleteApi(PRODUCT_TYPE_DELETE_API, data.id);
        gridController?.reloadData();
    };

    return (
        <AppContainer>
            {gridController?.loading ? (
                <Loading />
            ) : (
                <>
                    <BaseGrid
                        columnDefs={ProductTypeColDefs}
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
                        groupDisplayType={'groupRows'}
                        groupDefaultExpanded={-1}
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

export default ProductTypeListView;
