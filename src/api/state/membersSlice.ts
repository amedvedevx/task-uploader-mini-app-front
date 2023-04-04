import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { FriendsType, ItemsType } from '@/app/types';

export interface MembersState {
    selectedMembers: FriendsType[];
    selectedChats: ItemsType[];
}

const initialState: MembersState = {
    selectedMembers: [],
    selectedChats: [],
};

export const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        setSelectedMembers: (state, action: PayloadAction<FriendsType[]>) => {
            state.selectedMembers = action.payload;
        },

        setSelectedChats: (state, action: PayloadAction<ItemsType[]>) => {
            state.selectedChats = action.payload;
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

export const { setSelectedMembers, setSelectedChats, deleteMember, deleteChatMember } =
    membersSlice.actions;

export default membersSlice.reducer;
