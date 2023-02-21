import type { FC } from 'react';

import DocAndImageIcon from '@/assets/DocAndImgIcon.svg';

export const PreloadScreen: FC = () => (
    <div id='preload-screen'>
        <img
            alt='preload logo'
            src={DocAndImageIcon}
        />

        <span id='preload-screen-text'>Загрузка</span>
    </div>
);
