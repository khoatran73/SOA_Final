import { useQuery } from 'react-query';
import { PROVINCE_COMBO_API } from '~/configs';
import { requestApi } from '~/lib/axios';
import { Province } from '~/types/shared/Placement';

const getProvinces = () => {
    return requestApi<Province[]>('get', PROVINCE_COMBO_API);
};

export function useProvince() {
    return useQuery(['GET_PROVINCE_COMBO'], getProvinces);
}
