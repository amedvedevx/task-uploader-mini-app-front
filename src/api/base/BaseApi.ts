/* eslint-disable */
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import {
    onRequest,
    onRequestError,
    onResponse,
    onResponseError,
} from './lib/interceptor';
import { API_BASE_URL } from '@/app/config';

export interface IBaseApi {
    readonly baseURL: string;
    setBearer: (bearer: string) => void;
    get: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
    delete: <R, D>(url: string, data?: D, config?: AxiosRequestConfig) => Promise<R>;
    post: <R, D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<R>;
    put: <R>(url: string, config?: AxiosRequestConfig) => Promise<R>;
    patch: <R, D>(url: string, data: D, config?: AxiosRequestConfig) => Promise<R>;
}

export class BaseApi implements IBaseApi {
    private http: AxiosInstance;

    get baseURL() {
        return this.http.defaults.baseURL as string;
    }

    setBearer(bearer: string) {
        this.http.defaults.headers['Authorization'] = bearer;
    }

    constructor() {
        this.http = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-type': 'application/json',
            },
        });

        this.attachInterceptors()
    }

    attachInterceptors () {
        this.http.interceptors.request.use(onRequest, onRequestError)
        this.http.interceptors.response.use(onResponse, onResponseError);
    }

    async get<T = any, R = AxiosResponse<T>['data'], D = any>(
        url: string,
        config?: AxiosRequestConfig<D>,
    ): Promise<R> {
        const response = await this.http.get(url, config);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.data;
    }

    async delete<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<R> {
        const response = await this.http.delete(url, { ...config, data });

        return response.data;
    }

    async post<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<R> {
        const response = await this.http.post(url, data, config);

        return response.data;
    }

    async put<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<R> {
        const response = await this.http.put(url, data, config);

        return response.data;
    }

    async patch<T = any, R = AxiosResponse<T>, D = any>(
        url: string,
        data?: D,
        config?: AxiosRequestConfig<D>,
    ): Promise<R> {
        const response = await this.http.patch(url, data, config);

        return response.data;
    }
}
