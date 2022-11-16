import { useQuery } from 'react-query';
import { requestApi } from '~/lib/axios';
import { NEWS_DETAIL_API } from '~/page/home/api/api';
import { NewsResponse } from '~/types/home/news';

const getNewsDetail = (id?: string) => {
    return requestApi<NewsResponse>('get', NEWS_DETAIL_API + '/' + id);
};

export function useNewsDetail(id?: string) {
    return useQuery(['GET_NEWS_DETAIL', id], () => getNewsDetail(id));
}
