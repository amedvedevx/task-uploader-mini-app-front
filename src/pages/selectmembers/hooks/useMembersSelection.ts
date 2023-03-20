import { useState } from 'react';

type SelectedMembersType = string[];

type HandleSelectMember = (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => void;

type IsMemberActive = (rowId: string) => boolean;

type UseMembersSelection = (
    initialState: SelectedMembersType,
    allRowsIds: SelectedMembersType,
) => {
    selectedMembers: SelectedMembersType;
    handleSelectMember: HandleSelectMember;
    isMemberActive: IsMemberActive;
};

export const useMembersSelection: UseMembersSelection = (initialState = [], allRowsIds = []) => {
    const [selectedMembers, setSelectedMembers] = useState<SelectedMembersType>(initialState);

    const handleSelectMember: HandleSelectMember = (e, rowId) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedMembers((prevState) => {
            if (prevState.includes(rowId)) {
                return prevState.filter((i) => i !== rowId);
            }
            return [...prevState, rowId];
        });
    };

    const isMemberActive: IsMemberActive = (rowId) => selectedMembers.includes(rowId);

    return {
        selectedMembers,
        handleSelectMember,
        isMemberActive,
    };
};
