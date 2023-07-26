import type { Bearer } from '@/app/types';

export const getEduAccountStatus = (bearer: string): boolean => {
    const bearerJSON = JSON.parse(bearer.slice(6)) as Bearer;

    return bearerJSON.is_edu === 'true';
};
