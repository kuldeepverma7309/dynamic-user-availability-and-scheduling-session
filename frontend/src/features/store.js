import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/slices/authSlice';
import sessionReducer from '../features/slices/sessionSlice';
import availabilityReducer from '../features/slices/AvailabilitySlice';
import adminReducer from '../features/slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
    availability: availabilityReducer,
    admin: adminReducer
  },
})