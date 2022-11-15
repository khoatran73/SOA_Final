import { useQuery } from 'react-query';
import { requestApi } from '~/lib/axios';
import { CATEGORY_WITH_SLUG_API } from '~/page/product/category/api/api';
import { CategoryWithSlug } from '~/types/product/Category';

const getCategoriesSlug = () => {
    return requestApi<CategoryWithSlug[]>('get', CATEGORY_WITH_SLUG_API);
};

export function useCategorySlug() {
    return useQuery(['GET_CATEGORY_WITH_SLUG'], getCategoriesSlug);
}
