export interface IPost {
  uuid: any;
  imageUrl: string | null;
  files: Express.Multer.File[];
  userUuid: any;
  caption: string | null;
  privacyLevel: string | null;
  createdAt: Date | null;
}