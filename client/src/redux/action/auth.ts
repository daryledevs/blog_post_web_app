import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../assets/data/api";
import { userDataThunk } from "../action/user";
import { IEAuthData, IEAuthFetchError } from "../reduxIntface";


const checkAccess = createAsyncThunk<
  IEAuthData,
  void,
  { rejectValue: IEAuthFetchError }
>(
  "auth/checkAccess",
  async (_, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get("/check-token");
      const data = response.data;
      dispatch(userDataThunk(data.token));
      return fulfillWithValue(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          errorType: error?.response?.data.error,
          errorMessage: error?.response?.data.message,
        });
      }
      throw error;
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
