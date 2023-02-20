import type { ReactNode } from 'react';
import { useEffect, memo, useMemo, useState } from 'react';

import { IS_DEV, APP_DEV_AUTH } from '@/app/config';

import { useVkHash } from '../base/hooks';
import { ApiProvider } from './apiContext';
import type { ApiContextProps } from './apiContext';
import type { IBaseApi } from '../base/BaseApi';
import { BaseApi } from '../base/BaseApi';

interface ApiWrapperProps {
    children: ReactNode;
}
const api = new BaseApi();

export const ApiWrapper = memo(({ children }: ApiWrapperProps): JSX.Element => {
    const [apiInstance, setApiInstance] = useState<IBaseApi>();
    const bearer = useVkHash();
    const authBearer = IS_DEV ? APP_DEV_AUTH : bearer;

    const value = useMemo<ApiContextProps>(
        () => ({
            api: apiInstance,
        }),
        [apiInstance],
    );

    useEffect(() => {
        if (!authBearer) {
            return;
        }

        api.setBearer(authBearer);
        setApiInstance(api);
    }, [authBearer]);

    return <ApiProvider value={value}>{children}</ApiProvider>;
});
