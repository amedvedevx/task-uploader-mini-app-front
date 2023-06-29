import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthorizationState {
    bearer: string;
    token: string;
}

const initialState: AuthorizationState = {
    bearer: '',
    token: '',
};

export const authorizationSlice = createSlice<
    AuthorizationState,
    SliceCaseReducers<AuthorizationState>,
    'bearer'
>({
    name: 'bearer',
    initialState,
    reducers: {
        setBearer: (state, action: PayloadAction<string>) => {
            state.bearer = action.payload;
        },
        setToken: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
    },
});

export const { setBearer, setToken } = authorizationSlice.actions;

export default authorizationSlice.reducer;
