type PersonType = {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

type MessageType = {
  sender_id: number;
  receiver_id: number;
  conversation_id: number;
  text_message: string;
};

export type { MessageType, PersonType };
