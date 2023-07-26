export const IS_DEV = import.meta.env.DEV;

export const APP_ID = import.meta.env.VITE_APP_ID as string;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const APP_DEV_AUTH = import.meta.env.VITE_APP_DEV_AUTH as string;

export const UPLOAD_URL = `https://vk.com/app${APP_ID}#/upload/`;

export const UPLOAD_URL_EDU = `https://vk.com/app${APP_ID}#/upload/`; // `https://web.vk.me/miniapp/${APP_ID}?hash=%2Fupload%2F`;
