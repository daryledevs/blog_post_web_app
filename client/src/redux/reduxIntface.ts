
// actions
interface IEAuthData {
  message: string,
  user_data: object,
};

interface IEChatData extends Array<IEChatData> {
  [key: string]: any;
  conversation_id: number;
  first_name: string;
  last_name: string;
  message_id: number;
  sender_id: number;
  text_message: string;
  time_sent: string;
  user_one: number;
  user_two: number;
  username: any;
}

// reducers
interface IEUserState {
  [key: string]: any;
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  roles: string;
  age: number;
  birthday: string;
}

interface IEChatState {
  // [key: string]: any;
  conversation_id: number | null;
  first_name: string | null;
  last_name: string | null;
  message_id: number | null;
  sender_id: number | null;
  text_message: string | null;
  time_sent: string | null;
  user_one: number | null;
  user_two: number | null;
  username: any | null;
}

// thunk error
interface IEAuthFetchError {
  errorType: string;
  errorMessage: string;
}

export type {
  IEAuthData,
  IEChatData,
  IEAuthFetchError,
  IEChatState,
  IEUserState,
};