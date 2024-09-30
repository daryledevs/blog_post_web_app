export interface IPost {
  id: number;
  uuid: any;
  imageId: string;
  imageUrl: string | null;
  files: Express.Multer.File[];
  userId: number;
  userUuid: any;
  caption: string | null;
  privacyLevel: string | null;
  createdAt: Date | null;
}