export interface ISearchHistory {
  uuid: any;
  userUuid: string;
  username: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  createdAt: Date | null;
}
