import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthorizationState {
    value: string;
}

const initialState: AuthorizationState = {
    value: '',
};

export const authorizationSlice = createSlice({
    name: 'bearer',
    initialState,
    reducers: {
        setBearer: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
    },
});

export const { setBearer } = authorizationSlice.actions;

export default authorizationSlice.reducer;
