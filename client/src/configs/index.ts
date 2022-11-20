// export const APP_API_PATH = `${window.location.host}`
export const APP_API_PATH = process.env.REACT_APP_API_URL as string;

export const API_CHECK_LOGIN = APP_API_PATH + '/identity/check-login';
export const API_LOGIN = APP_API_PATH + '/identity/login';
export const API_LOGOUT = APP_API_PATH + '/identity/logout';
export const API_GET_USER = APP_API_PATH + '/identity/get-user';
export const API_UPDATE_USER = APP_API_PATH + '/identity/update';

export const API_ADD_USER = APP_API_PATH + '/identity/add-user';
export const API_REGISTER_USER = APP_API_PATH + '/identity/register-user';
export const API_GET_OTP_USER = APP_API_PATH + '/identity/get-otp';

export const UPDATE_DELIVERY_ADDRESS_API = APP_API_PATH + '/identity/update-delivery';


//layout

export const API_LAYOUT = APP_API_PATH + '/menu/layout';

// common api
export const COMBO_USER_WITH_KEY_API = APP_API_PATH + '/common/combo-user-with-key';
export const TRANSACTION_HISTORY_API = APP_API_PATH + '/history/get-all';

// upload file
export const UPLOAD_FILE_API = APP_API_PATH + '/common/upload-file';

//
export const PROVINCE_COMBO_API = APP_API_PATH + '/placement/provinces';
export const DISTRICT_COMBO_API = APP_API_PATH + '/placement/districts';
export const WARD_COMBO_API = APP_API_PATH + '/placement/wards';

//
export const VND_CHAR = '₫';
