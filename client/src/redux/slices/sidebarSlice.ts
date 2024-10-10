import { ReduxState, SidebarState } from "@/interfaces/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SidebarState = {
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
export const selectSidebar = (state: ReduxState) => state.sidebar;
export default sidebarSlice.reducer;
