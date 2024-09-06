import { createSlice } from '@reduxjs/toolkit';

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem('token');
  return token ? JSON.parse(token) : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromLocalStorage(),
    token: getTokenFromLocalStorage(),
  },
  reducers: {
    authUser: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export default authSlice.reducer;
export const { authUser } = authSlice.actions;