import bridge from '@vkontakte/vk-bridge';

export const getStorageItem = async (key: string): Promise<string | null> => {
    const isEmbedded = bridge.isEmbedded();

    if (!isEmbedded) {
        return localStorage.getItem(key) || null;
    }

    return bridge
        .send('VKWebAppStorageGet', { keys: [key] })
        .then((result) => result.keys[0].value || null);
};

export const setStorageItem = async (key: string, value: string): Promise<void> => {
    const isEmbedded = bridge.isEmbedded();

    if (isEmbedded) {
        await bridge.send('VKWebAppStorageSet', {
            key,
            value,
        });
    } else {
        localStorage.setItem(key, value);
    }
};
