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

            state.selectedMembers = state.selectedMembers.map((member) => ({
                ...member,
                full_name: `${member.first_name} ${member.last_name}`,
                groupName: 'Выбранные участники',
            }));
        },

        setSelectedChats: (state, action: PayloadAction<ChatType[]>) => {
            state.selectedChats = action.payload;
        },
    },
});

export const { setSelectedMembers, setSelectedChats } = membersSlice.actions;

export default membersSlice.reducer;
