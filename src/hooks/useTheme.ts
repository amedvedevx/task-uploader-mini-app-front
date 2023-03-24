import type { AppearanceType, VKBridgeEvent, ReceiveDataMap } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { Appearance } from '@vkontakte/vkui';
import { useEffect, useState } from 'react';
import type { DefaultUpdateConfigData } from '@vkontakte/vk-bridge/dist/types/src/types/data';

interface UseThemeResult {
    theme: AppearanceType;
}

export const useTheme = (): UseThemeResult => {
    const [theme, setTheme] = useState(Appearance.LIGHT);

    const subscription = ({ detail: { type, data } }: VKBridgeEvent<keyof ReceiveDataMap>) => {
        if (type === 'VKWebAppUpdateConfig') {
            if ((data as DefaultUpdateConfigData)?.appearance === 'dark') {
                setTheme(Appearance.DARK);
            } else {
                setTheme(Appearance.LIGHT);
            }
        }
    };

    useEffect(() => {
        bridge.send('VKWebAppGetConfig');
        bridge.subscribe(subscription);

        return () => {
            bridge.unsubscribe(subscription);
        };
    }, []);

    return { theme };
};
