import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface LayoutState {
    collectionHeader: string;
}

const initialState: LayoutState = {
    collectionHeader: '',
};

export const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        setCollectionHeader: (state, action: PayloadAction<string>) => {
            state.collectionHeader = action.payload;
        },
    },
});

export const { setCollectionHeader } = layoutSlice.actions;

export default layoutSlice.reducer;
