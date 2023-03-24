import { useLocation } from '@happysanta/router';

import { UserTypes } from '@/app/types';

export const useUserRole = (): string => {
    const location = useLocation();

    const userType = location.getPageId().includes('upload')
        ? UserTypes.TESTEE
        : UserTypes.ORGANIZER;

    return userType;
};
