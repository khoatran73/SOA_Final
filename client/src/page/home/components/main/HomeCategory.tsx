import { Image } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import emptyImage from '~/assets/layout/empty.jpg';
import Loading from '~/component/Elements/loading/Loading';
import ErrorView from '~/component/Layout/ErrorView';
import { useCategorySlug } from '~/hook/useCategory';

const HomeCategory: React.FC = () => {
    const { data: resCategory, isLoading, isError } = useCategorySlug();
    const categories = resCategory?.data?.result;

    if (isError) return <ErrorView />;
    if (isLoading) return <Loading />;
    return (
        <>
            <div className="uppercase font-bold mb-1">Danh mục</div>
            <div className="flex flex-wrap">
                {categories?.map(category => (
                    <Link
                        to={`/category?categorySlug=${category.slug}`}
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
