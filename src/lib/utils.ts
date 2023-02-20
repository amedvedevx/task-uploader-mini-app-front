export const capitalizeString = (stringToCap: string): string =>
    stringToCap[0].toUpperCase() + stringToCap.slice(1);

export const inclinationLesson = (quanty: number): string => {
    if (quanty === 1) return 'урок';

    if (quanty <= 4) return 'урока';

    if (quanty > 4) return 'уроков';

    return '';
};
