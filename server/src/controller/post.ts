import { join }                            from "path";
import Exception                           from "../exception/exception";
import * as dotenv                         from "dotenv";
import PostRepository                      from "../repository/post-repository";
import uploadAndDeleteLocal                from "../config/cloudinary";
import { Response, Request, NextFunction } from "express";
dotenv.config();

const getUserPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.query;
    const data = await PostRepository.getUserPosts(user_id as any);
    res.status(200).send({ post: data });
  } catch (error) {
    next(error);
  };
};

const getUserTotalPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.query;
    const data = await PostRepository.getUserTotalPosts(user_id as any);
    res.status(200).send({ totalPost: data });
  } catch (error: any) {
    next(error);
  };
};

const newPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const { user_id, caption } = req.body;
    const img = (req.files as { [fieldname: string]: Express.Multer.File[] })?.img;

    if(!req.files || !img) return next(Exception.badRequest("No image uploaded"));

    const path = join(img[0].destination, img[0].filename);
    const { image_id, image_url } = await uploadAndDeleteLocal(path);

    const post = { user_id, caption, image_id, image_url };
    const data = await PostRepository.newPost(post);
    res.status(200).send({ message: data });
  } catch (error) {
    next(error);
  };
};

const editPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const { user_id, roles, cookieOptions, ...rest } = req.body;

    const image_url = "Image url is not allowed to be changed";
    if (rest.image_url) return next(Exception.badRequest(image_url));

    const data = await PostRepository.editPost(post_id as any, rest );
    res.status(200).send({ message: data });
  } catch (error) {
    next(error);
  };
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const data = await PostRepository.deletePost(post_id as any);
    res.status(200).send({ message: data });
  } catch (error) {
    next(error);
  };
};

const getLikesCountForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_id } = req.params;
    const data = await PostRepository.getLikesCountForPost(post_id as any);
    res.status(200).send({ count: data });
  } catch (error) {
    next(error)
  };
};

const checkUserLikeStatusForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const args: any = req.params;
    const data = await PostRepository.isUserLikePost(args);
    res.status(200).send({ status: data ? true : false });
  } catch (error) {
    next(error)
  };
};

const toggleUserLikeForPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const args: any = req.params;

    // Check to see if the user already likes the post.
    const data = await PostRepository.isUserLikePost(args);

    if (!data) {
      // If the user hasn't liked the post yet, then create or insert.
      const data = await PostRepository.toggleUserLikeForPost(args);
      return res.status(200).send({ message: data });
    } else {
      // If the user has already liked the post, then delete or remove.
      const data = await PostRepository.removeUserLikeForPost(args);
      return res.status(200).send({ message: data });
    };
  } catch (error) {
    next(error)
  };
};

export {
  newPost,
  getUserPost,
  getUserTotalPosts,
  editPost,
  deletePost,
  getLikesCountForPost,
  checkUserLikeStatusForPost,
  toggleUserLikeForPost,
};