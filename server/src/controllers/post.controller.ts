import * as dotenv                         from "dotenv";
import PostsService                        from "@/services/post/post.service.impl";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import { Response, Request, NextFunction } from "express";
dotenv.config();

class PostsController {
  private postsService: PostsService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  public getUserPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { user_id } = req.query;
      const data = await this.postsService.getUserPosts(user_id as any);
      res.status(200).send({ post: data });
    }
  );

  public getUserTotalPosts = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { user_id } = req.query;
      const data = await this.postsService.getUserTotalPosts(user_id as any);
      res.status(200).send({ totalPost: data });
    }
  );

  public newPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { cookieOptions, ...rest } = req.body;

      const files =
        ((req.files as { [fieldname: string]: Express.Multer.File[] })
          ?.img as Express.Multer.File[]) || null;

      const data = await this.postsService.newPost(files[0], rest);
      res.status(200).send({ message: data });
    }
  );

  public editPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const post_id: any = req.params;
      const { user_id, roles, cookieOptions, ...rest } = req.body;
      const data = await this.postsService.editPost(post_id, rest);
      res.status(200).send({ message: data });
    }
  );

  public deletePost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const post_id: any = req.params;
      const data = await this.postsService.deletePost(post_id);
      res.status(200).send({ message: data });
    }
  );

  public getLikesCountForPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const post_id: any = req.params;
      const data = await this.postsService.getLikesCountForPost(post_id);
      res.status(200).send({ count: data });
    }
  );

  public checkUserLikeStatusForPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const args: any = req.params;
      const data = await this.postsService.checkUserLikeStatusForPost(args);
      res.status(200).send({ status: data ? true : false });
    }
  );

  public toggleUserLikeForPost = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const args: any = req.params;
      const data = await this.postsService.toggleUserLikeForPost(args);
      return res.status(200).send({ message: data });
    }
  );
};

export default PostsController;