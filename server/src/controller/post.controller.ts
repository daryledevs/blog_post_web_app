import * as dotenv                         from "dotenv";
import PostsService                        from "../service/post/post.service.impl";
import { Response, Request, NextFunction } from "express";
dotenv.config();

class PostsController {
  private postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  };

  public getUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.query;
      const data = await this.postsService.getUserPosts(user_id as any);
      res.status(200).send({ post: data });
    } catch (error) {
      next(error);
    };
  };

  public getUserTotalPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.query;
      const data = await this.postsService.getUserTotalPosts(user_id as any);
      res.status(200).send({ totalPost: data });
    } catch (error: any) {
      next(error);
    };
  };

  public newPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookieOptions, ...rest } = req.body;
      
      const files = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.img as Express.Multer.File[] || null;
      
      const data = await this.postsService.newPost(files[0], rest);
      res.status(200).send({ message: data });
    } catch (error) {
      next(error);
    };
  };

  public editPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post_id: any = req.params;
      const { user_id, roles, cookieOptions, ...rest } = req.body;
      const data = await this.postsService.editPost(post_id, rest);
      res.status(200).send({ message: data });
    } catch (error) {
      next(error);
    };
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post_id: any = req.params;
      const data = await this.postsService.deletePost(post_id);
      res.status(200).send({ message: data });
    } catch (error) {
      next(error);
    };
  };

  public getLikesCountForPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post_id: any = req.params;
      const data = await this.postsService.getLikesCountForPost(post_id);
      res.status(200).send({ count: data });
    } catch (error) {
      next(error);
    };
  };

  public checkUserLikeStatusForPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const args: any = req.params;
      const data = await this.postsService.checkUserLikeStatusForPost(args);
      res.status(200).send({ status: data ? true : false });
    } catch (error) {
      next(error);
    };
  };

  public toggleUserLikeForPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const args: any = req.params;
      const data = await this.postsService.toggleUserLikeForPost(args);
      return res.status(200).send({ message: data });
    } catch (error) {
      next(error);
    };
  };
};

export default PostsController;