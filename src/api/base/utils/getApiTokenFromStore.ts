import { getStorageItem } from '@/api/base/lib';
import type { Token } from '@/api';

export const getApiTokenFromStore = async (): Promise<Token | null> => {
    const apiToken = await getStorageItem('apiToken');

    if (!apiToken) {
        return null;
    }

    try {
        return JSON.parse(apiToken) as Token;
    } catch (error) {
        console.error('getApiTokenFromStore token parse error', error);
    }

    return null;
};
