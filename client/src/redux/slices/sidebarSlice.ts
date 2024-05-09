import { IEReduxState } from "@/interfaces/interface";
import { createSlice } from "@reduxjs/toolkit";

export interface IESidebarState {
  previous: string;
  current: string;
}

const initialState: IESidebarState = {
  previous: "",
  current: "",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    navigatedPage: (state, action) => {
      state.previous = state.current;
      state.current = action.payload;
    },
  },
});

export const { navigatedPage } = sidebarSlice.actions;
export const selectSidebar = (state: IEReduxState) => state.sidebar;
export default sidebarSlice.reducer;
