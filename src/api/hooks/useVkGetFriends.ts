import bridge from '@vkontakte/vk-bridge';
import { useState, useEffect, useRef } from 'react';

import { useVkToken } from '@/hooks/useVkToken';

export type FriendsType = {
    id: number;
    can_access_closed: boolean;
    first_name: string;
    is_closed: boolean;
    last_name: string;
    photo_50: string;
    track_code: string;
};

export interface UseVkGetFriendsResult {
    friends: FriendsType[];
    isFetching: React.MutableRefObject<boolean>;
}

export const useVkGetFriends = (): UseVkGetFriendsResult => {
    const [friends, setFriends] = useState<FriendsType[]>([]);
    const token = useVkToken();
    const isFetching = useRef<boolean>(false);

    console.log(token);

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
                    fields: 'photo_50',
                    count: 50,
                },
            })
            .then((data: { response: { items: FriendsType[] } }) => {
                setFriends(data.response.items);
            });
    }, [token]);

    return { friends, isFetching };
};
