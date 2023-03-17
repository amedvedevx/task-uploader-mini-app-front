import { useState } from 'react';

type SelectedRowsType = string[];

type HandleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => void;

type IsRowActive = (rowId: string) => boolean;

type UseTableSelection = (
    initialState: SelectedRowsType,
    allRowsIds: SelectedRowsType,
) => {
    selectedRows: SelectedRowsType;
    handleSelectRow: HandleSelectRow;
    isRowActive: IsRowActive;
};

export const useFriendsSelection: UseTableSelection = (initialState = [], allRowsIds = []) => {
    const [selectedRows, setSelectedRows] = useState<SelectedRowsType>(initialState);

    const handleSelectRow: HandleSelectRow = (e, rowId) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedRows((prevState) => {
            if (prevState.includes(rowId)) {
                return prevState.filter((i) => i !== rowId);
            }
            return [...prevState, rowId];
        });
    };

    const isRowActive: IsRowActive = (rowId) => selectedRows.includes(rowId);

    return {
        selectedRows,
        handleSelectRow,
        isRowActive,
    };
};
