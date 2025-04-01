import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, currentUser } from '@/lib/data';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: currentUser,
  isAuthenticated: true, // For demo purposes, user is already authenticated
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;