import { APP_API_PATH } from '~/configs';
const HOME_PATH = APP_API_PATH + '/home'

export const NEWS_CREATE_API = HOME_PATH + '/news/create';
export const NEWS_DETAIL_API = HOME_PATH + '/news/show';
export const NEWS_WITH_SLUG_API = HOME_PATH + '/news/category';
export const NEWS_OTHER_API = HOME_PATH + '/news/other';
export const NEWS_RELATION_API = HOME_PATH + '/news/relation';
export const NEWS_NEWEST_API = HOME_PATH + '/news/newest';
export const NEWS_SEARCH_API = HOME_PATH + '/news/search';
export const NEWS_BY_USER_ID_API = HOME_PATH + '/news/show-by-user';
export const NEWS_UPDATE_BUMP_API = HOME_PATH + '/news/update-bump';

