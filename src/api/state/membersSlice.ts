import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { FriendsType } from '@/app/types';

export type SelectedChatMembersType = {
    chatName: string;
    members: FriendsType[];
};

export interface MembersState {
    selectedMembers: FriendsType[];
    selectedChatMembers: SelectedChatMembersType[];
}

const initialState: MembersState = {
    selectedMembers: [],
    selectedChatMembers: [],
};

export const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        setSelectedMembers: (state, action: PayloadAction<FriendsType[]>) => {
            state.selectedMembers = action.payload;
        },

        setSelectedChatMembers: (
            state,
            action: PayloadAction<{ chatName: string; members: FriendsType[] }[]>,
        ) => {
            state.selectedChatMembers = action.payload;
        },

        deleteMember: (state, action: PayloadAction<number>) => {
            state.selectedMembers = state.selectedMembers.filter((el) => el.id !== action.payload);
        },

        deleteChatMember: (state, action: PayloadAction<number>) => {
            state.selectedChatMembers = state.selectedChatMembers.map((chat) => ({
                chatName: chat.chatName,
                members: chat.members.filter((member) => member.id !== action.payload),
            }));
        },
    },
});

export const { setSelectedMembers, setSelectedChatMembers, deleteMember, deleteChatMember } =
    membersSlice.actions;

export default membersSlice.reducer;
