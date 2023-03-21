import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface TaskState {
    taskName: string;
}

const initialState: TaskState = {
    taskName: '',
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTaskName: (state, action: PayloadAction<string>) => {
            state.taskName = action.payload;
        },
    },
});

export const { setTaskName } = taskSlice.actions;

export default taskSlice.reducer;
