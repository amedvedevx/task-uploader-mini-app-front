import { useState } from 'react';
import get from 'lodash.get';

interface UseSearchResult<T> {
    filteredData: T;
    search: string;
    changeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useSearch = <T extends []>(data: T, field: string | string[]): UseSearchResult<T> => {
    const [search, setSearch] = useState('');

    const doSearch = (searchVal: string): T => {
        if (!searchVal) {
            return [];
        }

        let filteredValues = [];

        if (field) {
            filteredValues = data.filter((element) =>
                (get(element, field) as unknown as string)
                    .toLowerCase()
                    .includes(searchVal.toLowerCase()),
            );
        } else {
            filteredValues = data.filter((element) =>
                (element as string).toLowerCase().includes(searchVal.toLowerCase()),
            );
        }

        return filteredValues;
    };

    const filteredData: T = search ? doSearch(search) : data;

    const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return { filteredData, search, changeSearch };
};
