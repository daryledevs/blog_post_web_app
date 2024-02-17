type Person = {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

interface IEOpenConversation extends Person {
  conversation_id: number;
  user_one: number;
  user_two: number;
}

export type { Person, IEOpenConversation };