import { useState } from 'react';

import type { FriendsType } from '@/app/types';

type SelectedMembersType = string[];

type SelectedCollectionType = FriendsType[];

type HandleSelectMember = (e?: React.ChangeEvent<HTMLInputElement>, rowId: string) => void;

type IsMemberActive = (rowId: string) => boolean;

export interface UseMembersSelectionResult {
    selectedMembers: SelectedMembersType;
    selectedCollection: SelectedCollectionType;
    handleSelectMember: HandleSelectMember;
    isMemberActive: IsMemberActive;
}

export const useMembersSelection = (
    initialState = [] as SelectedMembersType,
    allRowsIds = [] as SelectedMembersType,
    collection: SelectedCollectionType,
): UseMembersSelectionResult => {
    const [selectedMembers, setSelectedMembers] = useState<SelectedMembersType>(initialState);

    const handleSelectMember: HandleSelectMember = (e, rowId) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setSelectedMembers((prevState) => {
            if (prevState.includes(rowId)) {
                return prevState.filter((i) => i !== rowId);
            }

            return [...prevState, rowId];
        });
    };

    const isMemberActive: IsMemberActive = (rowId) => selectedMembers.includes(rowId);

    const selectedCollection: SelectedCollectionType = collection.filter((el) =>
        selectedMembers.includes(String(el.id)),
    );

    return {
        selectedMembers,
        selectedCollection,
        handleSelectMember,
        isMemberActive,
    };
};
