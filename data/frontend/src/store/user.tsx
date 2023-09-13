import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface UserState {
  username: string;
  isPlaying: boolean;
  isUserBlocked: boolean;
  blockedUsers: string[];
  isError: boolean;
  error: string;
}

const initialUser: UserState = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") || "{}")
  : {
      username: "",
      isUserBlocked: false,
      isPlaying: false,
      blockedUsers: [],
      isError: false,
      error: '',
    };

const initialState: UserState = {
  username: initialUser.username,
  isUserBlocked: initialUser.isUserBlocked,
  blockedUsers: initialUser.blockedUsers,
  isError: initialUser.isError,
  isPlaying: initialUser.isPlaying,
  error: initialUser.error,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state) => {
      state.blockedUsers = [];
      localStorage.setItem("user", JSON.stringify(state));
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      localStorage.setItem("user", JSON.stringify(state));
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    addBlockedUser: (state, action: PayloadAction<string>) => {
      const nbr = state.blockedUsers.indexOf(action.payload);
      if (nbr === -1) state.blockedUsers.push(action.payload);
    },
    removeBlockedUser: (state, action: PayloadAction<string>) => {
      const index = state.blockedUsers.indexOf(action.payload);
      if (index !== -1) state.blockedUsers.splice(index, 1);
    },
    isUserBlocked: (state) => {
      const nbr = state.blockedUsers.indexOf(state.username);
      state.isUserBlocked = (nbr !== -1);
    },
    setIsError: (state, error: PayloadAction<string>) => {
      state.isError = !state.isError;
      if (state.isError === true && error.payload !== '')
        state.error = error.payload;
      else
        state.error = '';
    }
  },
});

export const {
  login,
  setUsername,
  addBlockedUser,
  removeBlockedUser,
  isUserBlocked,
  setIsPlaying,
  setIsError,
} = userSlice.actions;
export default userSlice.reducer;
