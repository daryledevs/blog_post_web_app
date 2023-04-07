import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../assets/data/api";
import { getUserData } from "../reducer/user";
import { getChatThunk } from "../action/chat";
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

      dispatch(getChatThunk({ user_id: data.user_data.user_id, length: 0}));
      dispatch(getUserData(data.user_data));

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
      message: string;
    };
  }
>(
  "auth/login",
  async (userCredentials, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", userCredentials);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue({ message: error.response.data.message });
    }
  }
);

export { checkAccess, login };
