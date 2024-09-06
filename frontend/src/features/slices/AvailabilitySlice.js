import { createSlice } from '@reduxjs/toolkit';

const availabilitySlice = createSlice({
  name: 'availability',
  initialState: {
    availabilities: [],
  },
  reducers: {
    setAvailability: (state, action) => {
      state.availabilities = action.payload;
    },
  },
});

export const { setAvailability } = availabilitySlice.actions;

export default availabilitySlice.reducer;