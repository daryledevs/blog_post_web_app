import PostDto               from "@/domain/dto/post.dto";
import * as dotenv           from "dotenv";
import IEPostService         from "@/application/services/post/post.service";
import IELikeService         from "@/application/services/like/like.service";
import { plainToInstance }   from "class-transformer";
import { Response, Request } from "express";
dotenv.config();

class PostsController {
  private postService: IEPostService;
  private likeService: IELikeService;

  constructor(postService: IEPostService, likeService: IELikeService) {
    this.postService = postService;
    this.likeService = likeService;
  }

  public getPostByUuid = async (req: Request, res: Response) => {
    const uuid = req.params?.uuid!;
    const data = await this.postService.getPostByUuid(uuid);
    res.status(200).send({ post: data });
  };

  public getUserPosts = async (req: Request, res: Response) => {
    const user_uuid = req.params?.user_uuid!;
    const data = await this.postService.getAllPostsByUsersUuid(user_uuid);
    res.status(200).send({ post: data });
  };

  public getUserTotalPosts = async (req: Request, res: Response) => {
    const user_uuid = req.params?.user_uuid!;
    const data = await this.postService.geTotalPostsByUsersUuid(user_uuid);
    res.status(200).send({ totalPost: data });
  };

  public newPost = async (req: Request, res: Response) => {
    const reqBody = req.body;

    const files: Express.Multer.File[] =
      ((req.files as { [fieldname: string]: Express.Multer.File[] })
        ?.imgs as Express.Multer.File[]) || null;

    const obj = { ...reqBody, files } as Object;
    const postDto = plainToInstance(PostDto, obj);

    const data = await this.postService.createNewPost(postDto);
    res.status(200).send({ message: data });
  };

  public editPost = async (req: Request, res: Response) => {
    const reqBody = req.body;

    const postDto = plainToInstance(PostDto, reqBody as Object);

    const data = await this.postService.updatePostByUuid(postDto);
    res.status(200).send({ message: data });
  };

  public deletePost = async (req: Request, res: Response) => {
    const uuid = req.params?.uuid!;
    const data = await this.postService.deletePostByUuid(uuid);
    res.status(200).send({ message: data });
  };
  public getLikesCountForPost = async (req: Request, res: Response) => {
    const uuid = req.params?.uuid;
    const data = await this.likeService.getPostLikesCountByUuid(uuid!);
    res.status(200).send({ count: data });
  };

  public checkUserLikeStatusForPost = async (req: Request, res: Response) => {
    const user_uuid = req.params?.user_uuid!;
    const post_uuid = req.params?.uuid!;

    const data = await this.likeService.getUserLikeStatusForPostByUuid(
      user_uuid,
      post_uuid
    );

    res.status(200).send({ status: data ? true : false });
  };

  public toggleUserLikeForPost = async (req: Request, res: Response) => {
    const user_uuid = req.params?.user_uuid!;
    const post_uuid = req.params?.uuid!;

    const data = await this.likeService.toggleUserLikeForPost(
      user_uuid,
      post_uuid
    );

    return res.status(200).send({ message: data });
  };
};

export default PostsController;