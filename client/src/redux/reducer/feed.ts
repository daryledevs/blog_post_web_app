import { createSlice } from "@reduxjs/toolkit";
import { IEFeeds } from "../reduxIntface";

const initialState: IEFeeds = {
  feeds: [],
  feedStatus: false,
  lastRequest: null as any,
  setIsFirstLoad: true,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers:{
    getFeeds: (state, action) => {
      return { ...state, feeds: [...action.payload], setIsFirstLoad: false };
    },
    changeStatus: (state, action) => {
      state.feedStatus = action.payload;
    },
    changeTime: (state, action) => {
      state.lastRequest = action.payload;
    }
  }
});

export const { getFeeds, changeStatus, changeTime } = feedSlice.actions;
export default feedSlice.reducer;