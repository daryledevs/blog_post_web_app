import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import api from "../../assets/data/api";
import auth, { setAccessStatus } from '../reducer/auth';
import { IEAuthData, IEAuthFetchError } from "../reduxIntface";
import store, { RootState, AppDispatch } from '../store';

const checkAccess = createAsyncThunk<
  IEAuthData,
  { apiRequest: () => Promise<any> },
  { rejectValue: IEAuthFetchError, state: RootState, dispatch: AppDispatch  }
>(
  "auth/checkAccess",
  async ({ apiRequest }, { dispatch, getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest();
      // if access token is expired
      if (response.data.accessToken) {
        sessionStorage.setItem("token", response.data.accessToken);
        await dispatch(checkAccess({ apiRequest }));
      }
      return fulfillWithValue(response);
    } catch (error) {
      dispatch(setAccessStatus(error.response.data));
      rejectWithValue(error.response.data);
    }
  }
);

const login = createAsyncThunk<
  IEAuthData,
  { username: string; password: string },
  {
    rejectValue: {
      status: any,
      message: string;
    };
  }
>(
  "auth/login",
  async (userCredentials, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.post("/login", userCredentials);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue({
        status: error.response.data.status,
        message: error.response.data.message,
      });
    }
  }
);

export { checkAccess, login };
