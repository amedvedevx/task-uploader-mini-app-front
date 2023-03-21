import bridge from '@vkontakte/vk-bridge';
import { useState, useEffect } from 'react';

import { useVkToken } from '@/hooks/useVkToken';
import type { FriendsType } from '@/app/types';
import { useVkUserId } from '@/hooks';

export interface UseVkGetFriendsResult {
    friends: FriendsType[];
    isLoading: boolean;
}

export const useVkGetFriends = (search: string): UseVkGetFriendsResult => {
    const [friends, setFriends] = useState<FriendsType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = useVkToken();

    const vkUserId = useVkUserId(token);

    useEffect(() => {
        if (!token || !vkUserId) {
            return;
        }

        bridge
            .send('VKWebAppCallAPIMethod', {
                method: 'friends.search',
                params: {
                    access_token: token,
                    user_id: vkUserId,
                    q: search,
                    v: '5.131',
                    fields: 'photo_100',
                    count: 50,
                },
            })
            .then((data: { response: { items: FriendsType[] } }) => {
                setIsLoading(true);
                setFriends(data.response.items);
            })
            .catch((e) => setError(e));
    }, [token, vkUserId, search]);

    return { friends, isLoading };
};
