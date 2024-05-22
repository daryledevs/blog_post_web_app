import { IEUserState } from "./interface";

type PersonType = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
};

type ProfileProps = {
  user: IEUserState;
};

export type { PersonType, ProfileProps };
