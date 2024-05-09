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
      const payload = action.payload;
      state.previous = payload.previous;
      state.current = payload.current;
    },
  },
});

export const { navigatedPage } = sidebarSlice.actions;
export const selectSidebar = (state: IEReduxState) => state.sidebar;
export default sidebarSlice.reducer;
