import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { FriendsType } from '@/app/types';

export interface MembersState {
    selectedMembers: FriendsType[];
    selectedChatMembers: FriendsType[][];
    chatMemberIds: number[];
}

const initialState: MembersState = {
    selectedMembers: [],
    selectedChatMembers: [],
    chatMemberIds: [],
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
            action: PayloadAction<{ title: string; members: FriendsType[][] }>,
        ) => {
            state.selectedChatMembers = action.payload.members;
        },

        deleteMember: (state, action: PayloadAction<number>) => {
            state.selectedMembers = state.selectedMembers.filter((el) => el.id !== action.payload);
        },

        deleteChatMember: (state, action: PayloadAction<number>) => {
            state.selectedChatMembers = state.selectedChatMembers.map((chats) =>
                chats.map((chat) => chat).filter((member) => member.id !== action.payload),
            );
        },
    },
});

export const { setSelectedMembers, setSelectedChatMembers, deleteMember, deleteChatMember } =
    membersSlice.actions;

export default membersSlice.reducer;
