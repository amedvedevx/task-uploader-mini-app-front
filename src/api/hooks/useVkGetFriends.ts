import bridge from '@vkontakte/vk-bridge';
import { useState, useEffect, useRef } from 'react';

import { useVkToken } from '@/hooks/useVkToken';
import type { FriendsType } from '@/app/types';

export interface UseVkGetFriendsResult {
    friends: FriendsType[];
    isFetching: React.MutableRefObject<boolean>;
}

export const useVkGetFriends = (): UseVkGetFriendsResult => {
    const [friends, setFriends] = useState<FriendsType[]>([]);
    const token = useVkToken();
    const isFetching = useRef<boolean>(false);

    useEffect(() => {
        if (!token || isFetching.current) {
            return;
        }

        isFetching.current = true;

        bridge
            .send('VKWebAppCallAPIMethod', {
                method: 'friends.get',
                params: {
                    access_token: token,
                    v: '5.131',
                    fields: 'photo_100',
                    count: 50,
                },
            })
            .then((data: { response: { items: FriendsType[] } }) => {
                setFriends(data.response.items);
            });
    }, [token]);

    return { friends, isFetching };
};
