import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const onRequest = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig<any>> => {
    // eslint-disable-next-line no-console,@typescript-eslint/restrict-template-expressions
    console.info(`[request] [${config?.validateStatus}]`);

    return config;
};

export const onRequestError = (error: AxiosError): Promise<AxiosError> => Promise.reject(error);

export const onResponse = (response: AxiosResponse): AxiosResponse => response;

export const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
    // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
    console.error(`[response error] [${error.cause}]`);

    return Promise.reject(error);
};
