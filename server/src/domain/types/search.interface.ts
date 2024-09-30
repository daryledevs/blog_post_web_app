export interface ISearchHistory {
  id: number;
  uuid: any;
  searcherId: number;
  searchedId: number;
  userUuid: string;
  username: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  avatarUrl?: string | null | undefined;
  createdAt: Date | null;
}
