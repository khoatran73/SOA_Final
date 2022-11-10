import { Image } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import emptyImage from '~/assets/layout/empty.jpg';
import Loading from '~/component/Elements/loading/Loading';
import ErrorView from '~/component/Layout/ErrorView';
import { requestApi } from '~/lib/axios';
import { CATEGORY_WITH_SLUG_API } from '~/page/product/category/api/api';
import { CategoryWithSlug } from '~/types/product/Category';

const getCategories = () => {
    return requestApi<CategoryWithSlug[]>('get', CATEGORY_WITH_SLUG_API);
};

const HomeCategory: React.FC = () => {
    const { data: requestCategory, isLoading, isError } = useQuery(['GET_CATEGORY_WITH_SLUG'], getCategories);
    const categories = requestCategory?.data?.result;

    if (isError) return <ErrorView />;
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="uppercase font-bold mb-1">Danh mục</div>
            <div className="flex flex-wrap">
                {categories?.map(category => (
                    <Link
                        to={'/'}
                        className="flex flex-col items-center justify-center my-1.5 w-[12.5%]"
                        key={category.id}
                    >
                        <Image width={84} src={category?.imageUrl} preview={false} fallback={emptyImage} />
                        <div className="mt-1">{category.name}</div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default HomeCategory;
