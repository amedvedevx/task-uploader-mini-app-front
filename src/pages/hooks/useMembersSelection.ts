import { useState } from 'react';

import type { FriendsType, ItemsType } from '@/app/types';

type SelectedMembersType = number[];

type SelectedCollectionType = FriendsType[];

type SelectedChatCollectionType = ItemsType[];

type HandleSelectMember = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowId: number,
    type: 'chat' | 'user',
) => void;

type IsMemberActive = (rowId: number) => boolean;

export interface UseMembersSelectionResult {
    selectedMembers: SelectedMembersType;
    selectedChats: SelectedMembersType;
    selectedCollection: SelectedCollectionType;
    selectedChatCollection: SelectedChatCollectionType;
    handleSelectMember: HandleSelectMember;
    isMemberActive: IsMemberActive;
    isChatActive: IsMemberActive;
}

export const useMembersSelection = (
    initialState = [] as SelectedMembersType,
    allRowsIds = [] as SelectedMembersType,
    allChatIds = [] as SelectedMembersType,
    collection: SelectedCollectionType,
    chats: SelectedChatCollectionType,
): UseMembersSelectionResult => {
    const [selectedMembers, setSelectedMembers] = useState<SelectedMembersType>(initialState);
    const [selectedChats, setSelectedChats] = useState<SelectedMembersType>(initialState);

    const handleSelectMember: HandleSelectMember = (e, rowId, type) => {
        e.preventDefault();
        e.stopPropagation();

        if (type === 'chat') {
            setSelectedChats((prevState) => {
                if (prevState.includes(rowId)) {
                    return prevState.filter((i) => i !== rowId);
                }

                return [...prevState, rowId];
            });
        }

        setSelectedMembers((prevState) => {
            if (prevState.includes(rowId)) {
                return prevState.filter((i) => i !== rowId);
            }

            return [...prevState, rowId];
        });
    };

    const isMemberActive: IsMemberActive = (rowId) => selectedMembers.includes(rowId);

    const isChatActive: IsMemberActive = (rowId) => selectedChats.includes(rowId);

    const selectedCollection: SelectedCollectionType = collection?.filter((el) =>
        selectedMembers.includes(el.id),
    );

    const selectedChatCollection: SelectedChatCollectionType = chats?.filter((el) =>
        selectedChats.includes(el.peer.id),
    );

    return {
        selectedMembers,
        selectedChats,
        selectedCollection,
        selectedChatCollection,
        handleSelectMember,
        isMemberActive,
        isChatActive,
    };
};
