import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AuthorizationState {
    value: string;
    userInfo: { token: string; userId: number | null };
}

const initialState: AuthorizationState = {
    value: '',
    userInfo: {
        token: '',
        userId: null,
    },
};

export const authorizationSlice = createSlice({
    name: 'bearer',
    initialState,
    reducers: {
        setBearer: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        },
        setUserToken: (state, action: PayloadAction<{ token: string }>) => {
            state.userInfo.token = action.payload.token;
        },
        setUserId: (state, action: PayloadAction<{ userId: number }>) => {
            state.userInfo.userId = action.payload.userId;
        },
    },
});

export const { setBearer, setUserId, setUserToken } = authorizationSlice.actions;

export default authorizationSlice.reducer;
