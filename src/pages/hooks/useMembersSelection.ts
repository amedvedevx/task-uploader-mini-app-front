import { useState } from 'react';

import type { ChatType, TesteeType } from '@/app/types';
import { useGetUserIdQuery } from '@/api';

type IsMemberActive = (row: TesteeType) => boolean;

type IsChatActive = (row: ChatType) => boolean;

type SelectedMembersType = TesteeType[];

type SelectedChatsType = ChatType[];

type HandleSelectMember = (e: React.ChangeEvent<HTMLInputElement>, row: TesteeType) => void;

type HandleSelectChat = (e: React.ChangeEvent<HTMLInputElement>, row: ChatType) => void;

export interface UseMembersSelectionResult {
    isMemberActive: IsMemberActive;
    isChatActive: IsChatActive;
    selectedMembers: SelectedMembersType;
    selectedChats: SelectedChatsType;
    handleSelectMember: HandleSelectMember;
    handleSelectChat: HandleSelectChat;
    membersCount: number;
}

export const LIMIT_MEMBERS = 50;

export const useMembersSelection = (): UseMembersSelectionResult => {
    const [selectedMembers, setSelectedMembers] = useState<SelectedMembersType>([]);
    const [selectedChats, setSelectedChats] = useState<SelectedChatsType>([]);
    const { data: userId } = useGetUserIdQuery();

    const chatMembersCount = selectedChats.reduce(
        (result, number) =>
            result +
            number.chat_settings.active_ids?.filter((item) => item > 0 && item !== userId).length,
        0,
    );

    const membersCount = selectedMembers.length + chatMembersCount;

    const chatMembersCount = selectedChats.reduce(
        (result, number) => result + number.chat_settings.members_count - 1,
        0,
    );

    const membersCount = selectedMembers.length + chatMembersCount;

    const handleSelectChat: HandleSelectChat = (e, row) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedChats((prevState) => {
            if (prevState.map((el) => el.peer.id).includes(row.peer.id)) {
                return prevState.filter((i) => i.peer.id !== row.peer.id);
            }

            return membersCount >= LIMIT_MEMBERS ? [...prevState] : [...prevState, row];
        });
    };

    const handleSelectMember: HandleSelectMember = (e, row) => {
        e.preventDefault();
        e.stopPropagation();

        setSelectedMembers((prevState) => {
            if (prevState.map((el) => el.id).includes(row.id)) {
                return prevState.filter((i) => i.id !== row.id);
            }

            return membersCount >= LIMIT_MEMBERS ? [...prevState] : [...prevState, row];
        });
    };

    const isMemberActive: IsMemberActive = (row) =>
        selectedMembers.map((el) => el.id).includes(row.id);

    const isChatActive: IsChatActive = (row) =>
        selectedChats.map((el) => el.peer.id).includes(row.peer.id);

    return {
        isMemberActive,
        isChatActive,
        selectedMembers,
        selectedChats,
        handleSelectMember,
        handleSelectChat,
        membersCount,
    };
};
