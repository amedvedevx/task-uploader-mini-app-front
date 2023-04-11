import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { TesteeType, ChatType } from '@/app/types';

export interface MembersState {
    selectedMembers: TesteeType[];
    selectedChats: ChatType[];
}

const initialState: MembersState = {
    selectedMembers: [],
    selectedChats: [],
};

export const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        setSelectedMembers: (state, action: PayloadAction<TesteeType[]>) => {
            state.selectedMembers = action.payload;
            state.selectedMembers = state.selectedMembers.map((el) => ({
                ...el,
                full_name: `${el.first_name} ${el.last_name}`,
                chatName: '',
            }));
        },

        setSelectedChats: (state, action: PayloadAction<ChatType[]>) => {
            state.selectedChats = action.payload;
        },
    },
});

export const { setSelectedMembers, setSelectedChats } = membersSlice.actions;

export default membersSlice.reducer;
