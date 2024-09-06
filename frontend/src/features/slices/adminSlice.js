import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    totalSessions: null,
    availableSlots: null,
    notifications: null,
    recentSessions: [],
    availabilities: [],
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        getData:(state,action)=>{
            state.totalSessions = action.payload.totalSessions;
            state.availableSlots = action.payload.availableSlots;
            state.notifications = action.payload.notifications;
            state.availabilities = action.payload.availabilities;
            state.recentSessions = action.payload.recentSessions;
        }
    }
});

export const {getData} = adminSlice.actions;
export default adminSlice.reducer;