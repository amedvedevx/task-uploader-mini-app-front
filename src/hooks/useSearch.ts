import { useState } from 'react';
import get from 'lodash.get';

interface UseSearchResult<T> {
    filteredData: T;
    search: string;
    changeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useSearch = <T>(data: T, field: string | string[]): UseSearchResult<T> => {
    const [search, setSearch] = useState('');

    const doSearch = (searchVal: string[]) => {
        if (!searchVal) {
            return;
        }

        let filteredValues = [];

        if (field) {
            filteredValues = data.filter((element) =>
                get(element, field).toLowerCase().includes(searchVal.toLowerCase()),
            );
        } else {
            filteredValues = data.filter((element) =>
                element.toLowerCase().includes(searchVal.toLowerCase()),
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
