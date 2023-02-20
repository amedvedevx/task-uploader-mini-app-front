import type { UserInfo } from '@vkontakte/vk-bridge';
import bridge from '@vkontakte/vk-bridge';
import { useEffect, useState } from 'react';

interface UseAvatarResult {
    avatarType: string;
    userInfo: UserInfo | undefined;
}

export const useAvatar = (userId?: string | number): UseAvatarResult => {
    const [avatarType, setAvatarType] = useState<string>('initials');
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const defaultPhotolink = 'https://vk.com/images/camera_100.png';

    useEffect(() => {
        if (Number(userId)) {
            bridge
                .send('VKWebAppGetUserInfo', {
                    user_id: Number(userId),
                })
                .then((data) => {
                    if (data.id) {
                        setUserInfo(data);

                        if (data.photo_100 === defaultPhotolink) {
                            switch (data.sex) {
                                case 1:
                                    setAvatarType('female');
                                    break;
                                case 2:
                                    setAvatarType('male');
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            setAvatarType('photo');
                        }
                    }
                })
                .catch((error) => {
                    // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                    console.error(`Ошибка: ${error.error_type}`, error.error_data);
                });
        }
    }, [userId]);

    return { avatarType, userInfo };
};
