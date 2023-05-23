import bridge from '@vkontakte/vk-bridge';

export interface UseCustomEventsLogResult {
    sendActionToCustomEvent: (actionType: string, actionText: string) => void;
}

export const useCustomEventsLog = (): UseCustomEventsLogResult => {
    // custom events are not in the public API
    const sendActionToCustomEvent = (actionType: string, actionText: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // TODO ME-41476 - refactor bridge calls to api layer
        bridge.send('VKWebAppSendCustomEvent', {
            type: `Click to diary action: ${actionType}`,
            event: actionText,
            screen: 'main',
            timezone: '3gtm',
        });
    };

    return {
        sendActionToCustomEvent,
    };
};
