import type { Context, Consumer, Provider } from 'react';
import { createContext } from 'react';

export interface ApiContextProps {
    api: undefined;
    setCurrentApi: (baseUrl: string, accessToken?: string) => void;
    diaryUser: undefined;
}

const ApiContext: Context<ApiContextProps> = createContext({} as unknown as ApiContextProps);
const ApiConsumer: Consumer<ApiContextProps> = ApiContext.Consumer;
const ApiProvider: Provider<ApiContextProps> = ApiContext.Provider;

export default ApiContext;

export { ApiConsumer, ApiProvider };
