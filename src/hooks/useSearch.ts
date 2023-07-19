import { useState } from 'react';
import get from 'lodash.get';

import { useGetUserIdQuery } from '@/api';

interface UseSearchResult<T> {
    filteredData: T;
    search: string;
    changeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type Item = {
    id: number;
};

export const useSearch = <T extends Item>(
    data: Array<T>,
    field: string | string[],
): UseSearchResult<Array<T>> => {
    const { data: userId } = useGetUserIdQuery();
    const [search, setSearch] = useState('');

    const doSearch = (searchVal: string): Array<T> => {
        if (!searchVal || !field) {
            return data;
        }

        let filteredValues = [];

        filteredValues = data.filter((element) =>
            (get(element, field) as unknown as string)
                .toLowerCase()
                .includes(searchVal.toLowerCase()),
        );

        return filteredValues;
    };

    const filteredData: Array<T> = doSearch(search).filter((item) => item.id !== userId);

    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return { filteredData, search, changeSearch };
};
