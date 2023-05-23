/* eslint-disable no-console */
import type { EGetLaunchParamsResponsePlatforms, ErrorData } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useState, useEffect } from 'react';

export const useBridgePlatform = (): string => {
    const [platform, setPlatform] = useState<EGetLaunchParamsResponsePlatforms | ''>('');

    useEffect(() => {
        bridge
            // TODO ME-41476 - refactor bridge calls to api layer
            .send('VKWebAppGetLaunchParams')
            .then((data) => {
                setPlatform(data.vk_platform);
            })
            .catch((error: ErrorData) => {
                // eslint-disable-next-line no-console
                console.error(`Ошибка: ${error.error_type}`, error.error_data);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return platform;
};
