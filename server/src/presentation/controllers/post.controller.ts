import * as dotenv                         from "dotenv";
import AsyncWrapper                        from "@/application/utils/async-wrapper.util";
import IEPostService                       from "@/application/services/post/post.service";
import IELikeService                       from "@/application/services/like/like.service";
import { Response, Request, NextFunction } from "express";
dotenv.config();

class PostsController {
  private postService: IEPostService;
  private likeService: IELikeService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(postService: IEPostService, likeService: IELikeService) {
    this.postService = postService;
    this.likeService = likeService;
  };

  public getUserPosts = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_uuid = req.params?.user_uuid;
      const data = await this.postService.getAllPostsByUsersUuid(user_uuid);
      res.status(200).send({ post: data });
    }
  );

  public getUserTotalPosts = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_uuid = req.params?.user_uuid;
      const data = await this.postService.geTotalPostsByUsersUuid(user_uuid);
      res.status(200).send({ totalPost: data });
    }
  );

  public newPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { cookieOptions, ...rest } = req.body;

      const files: Express.Multer.File[] =
        ((req.files as { [fieldname: string]: Express.Multer.File[] })
          ?.img as Express.Multer.File[]) || null;

      const data = await this.postService.createNewPost(files?.[0], rest);
      res.status(200).send({ message: data });
    }
  );

  public editPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const uuid = req.params?.uuid;
      const { user_uuid, roles, cookieOptions, ...rest } = req.body;
      const data = await this.postService.updatePostByUuid(uuid, rest);
      res.status(200).send({ message: data });
    }
  );

  public deletePost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const uuid = req.params?.uuid;
      const data = await this.postService.deletePostByUuid(uuid);
      res.status(200).send({ message: data });
    }
  );

  public getLikesCountForPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const uuid = req.params?.uuid;
      const data = await this.likeService.getPostLikesCountByUuid(uuid);
      res.status(200).send({ count: data });
    }
  );

  public checkUserLikeStatusForPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_uuid = req.params?.user_uuid;
      const post_uuid = req.params?.uuid;

      const data = await this.likeService.getUserLikeStatusForPostByUuid(
        user_uuid,
        post_uuid
      );

      res.status(200).send({ status: data ? true : false });
    }
  );

  public toggleUserLikeForPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_uuid = req.params?.user_uuid;
      const post_uuid = req.params?.uuid;

      const data = await this.likeService.toggleUserLikeForPost(
        user_uuid,
        post_uuid
      );

      return res.status(200).send({ message: data });
    }
  );
};

export default PostsController;