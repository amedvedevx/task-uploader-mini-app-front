import { useContext } from 'react';

import type { ApiContextProps } from '@/api/apiContext/apiContext';
import ApiContext from '@/api/apiContext/apiContext';

export function useApi(): ApiContextProps {
    return useContext(ApiContext);
}
