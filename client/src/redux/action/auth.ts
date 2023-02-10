import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../assets/data/api";

type AuthData = {
  message: string;
};

interface AuthFetchError {
  errorType: string;
  errorMessage: string;
}

const checkAccess = createAsyncThunk<
  AuthData,
  void,
  { rejectValue: AuthFetchError }
>("auth/checkAccess", async (_, { fulfillWithValue, rejectWithValue }) => {
  try {
    const response = await api.get("/check-token");
    return fulfillWithValue(response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        errorType: error?.response?.data.error,
        errorMessage: error?.response?.data.message,
      });
    }
    throw error;
  }
});

const login = createAsyncThunk<
  AuthData,
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
