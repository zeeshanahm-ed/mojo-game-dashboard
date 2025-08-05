import axios from 'axios';

import { IAuthModel, IUserModel } from './_models';

const AUTH_LOCAL_STORAGE_KEY = import.meta.env.VITE_AUTH_LOCAL_STORAGE_KEY as string;
const USER_LOCAL_STORAGE_KEY = import.meta.env.VITE_USER_LOCAL_STORAGE_KEY as string;

const getAuth = (): IAuthModel | undefined => {
  // debugger
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const auth: IAuthModel = JSON.parse(lsValue) as IAuthModel;
    if (auth) {
      return auth;
    }
  } catch (error) {
    // console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: IAuthModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    // console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};
const getUser = (): IUserModel | undefined => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const user: IUserModel = JSON.parse(lsValue) as IUserModel;
    if (user) {
      // You can easily check auth_token expiration also
      // eslint-disable-next-line consistent-return
      return user;
    }
  } catch (error) {
    // console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};
const setUser = (user: IUserModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(user);
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    // console.error('AUTH LOCAL STORAGE SAVE ERROR', error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  } catch (error) {
    // console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function setupAxios() {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

  axios.interceptors.request.use((config) => {
    const changedConfig = config;

    const token = getAuth()?.api_token;
    if (token && config.headers) {
      changedConfig.headers.Authorization = `Bearer ${token}`;
    }

    return changedConfig;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const isUnAuthorized = Boolean(error?.response?.status === 403) || Boolean(error?.response?.status === 401);
      if (isUnAuthorized) removeAuth();

      return Promise.reject(error);
    }
  );
}

export { getAuth, setUser, getUser, setAuth, removeAuth, AUTH_LOCAL_STORAGE_KEY };
