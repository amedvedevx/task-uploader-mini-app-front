import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { FriendsType } from '@/app/types';

export interface MembersState {
    selectedMembers: FriendsType[];
}

const initialState: MembersState = {
    selectedMembers: [],
};

export const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        setSelectedMembers: (state, action: PayloadAction<FriendsType[]>) => {
            state.selectedMembers = action.payload;
        },

        deleteMember: (state, action: PayloadAction<number>) => {
            state.selectedMembers = state.selectedMembers.filter((el) => el.id !== action.payload);
        },
    },
});

export const { setSelectedMembers, deleteMember } = membersSlice.actions;

export default membersSlice.reducer;
