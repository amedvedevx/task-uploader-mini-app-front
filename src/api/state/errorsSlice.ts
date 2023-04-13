import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface ErrorsState {
    type: string;
    text: string;
}

const initialState: ErrorsState[] = [];

export const errorsSlice = createSlice({
    name: 'errors',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<{ type: string; text: string }>) => {
            const error = { type: action.payload.type, text: action.payload.text };
            state.push(error);
        },
    },
});

export const { setError } = errorsSlice.actions;

export default errorsSlice.reducer;
