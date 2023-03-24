import { useRef } from 'react';
import type { MouseEvent } from 'react';

const MAX_SHIFTING_X_TO_RECOGNIZE_CLICK = 10;

interface UsePreventClickOnSwipeResult {
    handleMouseDownEl: (e: MouseEvent) => void;
    checkIsClick: (e: MouseEvent) => boolean;
}

/** Хук, реализующий логику проверки клика на элементе */
export const usePreventClickOnSwipe = (): UsePreventClickOnSwipeResult => {
    const clickStartXPos = useRef(0);

    /** Записать начальное значение курсора */
    const handleMouseDownEl = (e: MouseEvent) => {
        clickStartXPos.current = e.screenX;
    };

    /** Проверить клик ли это на элементе
     *
     * 1. высчитать смещение курсора текущей позиции от начальной позиции
     * 2. проверить смещение больше ли заданного максимального смещения:
     *      если true: вернуть true в функцию вызова
     *      если false: отменить событие клика и вернуть false в функцию вызова
     * */
    const checkIsClick = (e: MouseEvent): boolean => {
        const delta = Math.abs(e.screenX - clickStartXPos.current);

        if (delta > MAX_SHIFTING_X_TO_RECOGNIZE_CLICK) {
            e.preventDefault();

            return false;
        }

        return true;
    };

    return { handleMouseDownEl, checkIsClick };
};
