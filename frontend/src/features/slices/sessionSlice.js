import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    sessions: [],
  },
    reducers: {
        getSessions: (state, action) => {
        state.sessions = action.payload;
        },
    },
});

export default sessionSlice.reducer;
export const { getSessions } = sessionSlice.actions;
