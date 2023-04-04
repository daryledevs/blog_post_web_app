
// actions
interface IEAuthData {
  message: string,
  user_data: object,
};

interface IEChatData {
  message: string;
  conversation_id: any;
  sender_id: any;
  receiver_id: any;
  time_conversation: any;
}

// reducers
interface IEUserState {
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
  conversation_id: any;
  sender_id: any;
  receiver_id: any;
  time_conversation: any;
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