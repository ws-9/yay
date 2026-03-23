const API_BASE_URL = 'http://localhost:8080/api/v2';

export const API_REGISTER_URL = API_BASE_URL + '/auth/register';
export const API_LOGIN_URL = API_BASE_URL + '/auth/login';
export const API_REFRESH_URL = API_BASE_URL + '/auth/refresh';
export const API_LOGOUT_URL = API_BASE_URL + '/auth/logout';

export const API_ME = API_BASE_URL + '/me';
export const API_ROLES = API_BASE_URL + '/roles';
export const API_USERS = API_BASE_URL + '/users';
export const API_COMMUNITIES = API_BASE_URL + '/communities';
export const API_CHANNELS = API_BASE_URL + '/channels';
export const API_MEMBERS = API_BASE_URL + '/members';
export const API_MESSAGES = API_BASE_URL + '/messages';
export const API_CHANNEL_PERMISSIONS = API_BASE_URL + '/channel-permissions';
export const API_INVITES = API_BASE_URL + '/invites';
export const API_BANS = API_BASE_URL + '/bans';

export const WS_BROKER = 'ws://localhost:8080/ws';

export const CHANNEL_MESSAGES_PAGE_SIZE = 50;
