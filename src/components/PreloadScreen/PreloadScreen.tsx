import type { FC } from 'react';
import { useAppearance } from '@vkontakte/vkui';

import DocAndImageIcon from '@/assets/docAndImgIcon.svg';

export const PreloadScreen: FC = () => {
    const appearance = useAppearance();

    return (
        <div id='preload-screen'>
            <img
                alt='preload logo'
                src={DocAndImageIcon}
            />

            <span
                style={{ color: appearance === 'light' ? 'black' : 'white' }}
                id='preload-screen-text'
            >
                Загрузка
            </span>
        </div>
    );
};
