import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Empty, Pagination, Radio, Select, Space } from 'antd';
import Slider from 'antd/lib/slider';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ButtonBase } from '~/component/Elements/Button/ButtonBase';
import Loading from '~/component/Elements/loading/Loading';
import { BaseIcon } from '~/component/Icon/BaseIcon';
import ModalBase, { ModalRef } from '~/component/Modal/ModalBase';
import { VND_CHAR } from '~/configs';
import { EMPTY_DESCRIPTION } from '~/configs/contants';
import { useCategorySlug } from '~/hook/useCategory';
import { useMergeState } from '~/hook/useMergeState';
import { useProvince } from '~/hook/useProvince';
import { PaginatedList, PaginatedListQuery, requestApi } from '~/lib/axios';
import { NewsSearch } from '~/types/home/news';
import { ComboOption } from '~/types/shared';
import LocaleUtil from '~/util/LocaleUtil';
import PaginationUtil from '~/util/PaginationUtil';
import { NEWS_SEARCH_API } from '../../api/api';
import BoxContainer from '../../layout/BoxContainer';
import NewsResultSearchInfo from '../news/NewsResultSearchInfo';
import HomeBreadCrumb from './../../layout/HomeBreadCrumb';

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

type CategoryFilterProps = {
    modalRef: React.RefObject<ModalRef>;
};

const Card = (props: CardProps) => {
    return <div className={clsx('my-2 rounded-sm p-3', props.className)}>{props.children}</div>;
};

const CategoryFilter = (props: CategoryFilterProps) => {
    const filterClassName = 'px-2 py-1 rounded cursor-pointer border border-gray-700 mr-2';
    return (
        <div className="flex">
            <div
                className={filterClassName}
                onClick={() => {
                    props.modalRef.current?.onOpen(
                        <Filter onClose={props.modalRef?.current?.onClose} />,
                        'Lọc kết quả',
                        '40%',
                        faFilter,
                    );
                }}
            >
                <BaseIcon icon={faFilter} size="sm" className="mr-1" />
                Lọc
            </div>
            {/* <div className={filterClassName}>
                <BaseIcon icon={faLocationPin} size="sm" className="mr-1" />
                Toàn quốc
            </div>
            <div className={filterClassName}>catgory</div> */}
        </div>
    );
};

type FilterRequest = Partial<PaginatedListQuery> & {
    minPrice: number;
    maxPrice: number;
    orderBy: 'new' | 'price' | string;
    provinceCode: string;
    categorySlug: string;
    searchKey: string;
};
const TenMillions = 10000000;
const OneHundredThousand = 100000;
type FilterProps = {
    onClose: () => void;
};

const getFilterRequest = (searchParams: URLSearchParams) => {
    return {
        minPrice: Number(searchParams.get('minPrice')),
        maxPrice: Number(searchParams.get('maxPrice') ?? TenMillions),
        orderBy: searchParams.get('orderBy') ?? 'new',
        provinceCode: searchParams.get('provinceCode') ?? 'all',
        categorySlug: searchParams.get('categorySlug') ?? 'all',
        searchKey: searchParams.get('searchKey') ?? '',
    };
};

const Filter = (props: FilterProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const filterState: FilterRequest = getFilterRequest(searchParams);
    const defaultFilterState: FilterRequest = {
        minPrice: 0,
        maxPrice: TenMillions,
        orderBy: 'new',
        provinceCode: 'all',
        categorySlug: 'all',
        searchKey: '',
    };
    const [state, setState] = useMergeState<FilterRequest>(filterState);
    const { data: resProvince } = useProvince();
    const { data: resCategory } = useCategorySlug();
    const provinces = resProvince?.data?.result;
    const categories = resCategory?.data?.result;

    const handleApply = () => {
        setSearchParams({ ...state, page: searchParams.get('page') ?? 1 } as Record<string, any>);
        props.onClose();
    };

    const handleResetFilter = () => {
        setState(defaultFilterState);
        setSearchParams({ ...defaultFilterState, page: 1 } as Record<string, any>);
        props.onClose();
    };

    return (
        <div>
            <div>
                <div className="font-bold mb-1">Lọc theo danh mục</div>
                <Select
                    className="w-full"
                    options={([{ value: 'all', label: 'Tất cả danh mục' }] as ComboOption[]).concat(
                        categories?.map(category => ({ value: category.slug, label: category.name } as ComboOption)) ??
                            [],
                    )}
                    placeholder="Chọn Danh mục ..."
                    value={state.categorySlug}
                    showSearch
                    filterOption={(input, option) => LocaleUtil.includesWithoutLocate(option?.label ?? '', input)}
                    onChange={val => setState({ categorySlug: val })}
                />
            </div>
            <div className="mt-4">
                <div>
                    Giá từ{' '}
                    <b>
                        {LocaleUtil.toLocaleString(state.minPrice)} {VND_CHAR}
                    </b>{' '}
                    đến{' '}
                    <b>
                        {state.maxPrice === TenMillions ? (
                            <>
                                {LocaleUtil.toLocaleString(state.maxPrice)}
                                {'+'}
                            </>
                        ) : (
                            LocaleUtil.toLocaleString(state.maxPrice)
                        )}{' '}
                        {VND_CHAR}
                    </b>
                </div>
                <Slider
                    range
                    value={[state.minPrice, state.maxPrice]}
                    min={0}
                    max={TenMillions}
                    step={OneHundredThousand}
                    //
                    tooltipVisible={false}
                    onChange={value =>
                        setState({
                            minPrice: value[0],
                            maxPrice: value[1],
                        })
                    }
                />
            </div>
            <div className="mt-4">
                <div className="font-bold mb-1">Sắp xếp theo</div>
                <Radio.Group
                    onChange={e =>
                        setState({
                            orderBy: e.target.value,
                        })
                    }
                    value={state.orderBy}
                >
                    <Space direction="vertical">
                        <Radio value={'new'}>Tin mới trước</Radio>
                        <Radio value={'price'}>Giá thấp trước</Radio>
                    </Space>
                </Radio.Group>
            </div>
            <div className="mt-4">
                <div className="font-bold mb-1">Lọc theo khu vực</div>
                <Select
                    className="w-full"
                    options={([{ value: 'all', label: 'Toàn quốc' }] as ComboOption[]).concat(
                        provinces?.map(province => ({ value: province.code, label: province.name } as ComboOption)) ||
                            [],
                    )}
                    placeholder="Chọn Tỉnh/TP ..."
                    value={state.provinceCode}
                    showSearch
                    filterOption={(input, option) => LocaleUtil.includesWithoutLocate(option?.label ?? '', input)}
                    onChange={val => setState({ provinceCode: val })}
                />
            </div>
            <div className="flex items-center justify-center w-full mt-5">
                <ButtonBase title="Áp dụng" variant="success" onClick={handleApply} />
                <ButtonBase title="Bỏ lọc" variant="warning" onClick={handleResetFilter} />
            </div>
        </div>
    );
};

const DefaultItemsPerPage = 10;

const CategorySearch: React.FC = () => {
    const modalRef = useRef<ModalRef>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [newsResult, setNewsResult] = useState<PaginatedList<NewsSearch>>();
    const [loading, setLoading] = useState<boolean>(true);

    const onFilter = async () => {
        setLoading(true);
        const page = Number(searchParams.get('page') ?? 1);
        const offset = PaginationUtil.countOffset(page, DefaultItemsPerPage);
        const limit = PaginationUtil.countLimit(page, DefaultItemsPerPage);

        const request: FilterRequest = {
            ...getFilterRequest(searchParams),
            offset,
            limit,
        };

        const response = await requestApi<PaginatedList<NewsSearch>>('get', NEWS_SEARCH_API, {}, { params: request });
        if (response?.data?.success) {
            setNewsResult(response?.data?.result);
        }
        setLoading(false);
    };

    useEffect(() => {
        onFilter();
    }, [searchParams]);

    return (
        <BoxContainer className="p-0 bg-transparent">
            <div className="flex">
                <div className="flex flex-col w-[65%]" style={{ minHeight: 500 }}>
                    <HomeBreadCrumb
                        item={[{ title: 'Trang chủ', link: '/' }, { title: 'Tìm kiếm' }]}
                        className="my-1 py-1"
                    />
                    <Card className="my-1 py-1">
                        <CategoryFilter modalRef={modalRef} />
                    </Card>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
                            <Card className="p-0">
                                {newsResult?.items.length === 0 ? <Empty description={EMPTY_DESCRIPTION} /> : newsResult?.items.map(news => (
                                    <div className="flex flex-col" key={news.id}>
                                        <NewsResultSearchInfo news={news} />
                                    </div>
                                ))}
                            </Card>
                            <Card>
                                <Pagination
                                    defaultCurrent={Number(newsResult?.currentPage) + 1}
                                    total={newsResult?.totalCount}
                                    defaultPageSize={DefaultItemsPerPage}
                                    onChange={page =>
                                        setSearchParams({ ...getFilterRequest(searchParams), page: page } as Record<
                                            string,
                                            any
                                        >)
                                    }
                                />
                            </Card>
                        </>
                    )}
                </div>
                <div className="w-[35%] bg-transparent" />
            </div>

            <ModalBase ref={modalRef} />
        </BoxContainer>
    );
};

export default CategorySearch;
