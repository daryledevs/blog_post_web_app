import { NextFunction, Request, Response } from "express";
import Exception from "../exception/exception";
import UserRepository from "../repository/user-repository";

interface User {
  password: string;
  [key: string]: any;
}

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const { person } = req.query;

    let data: User | undefined = undefined;

    // If no parameters are provided, return an error
    if(!user_id && !person) return next(Exception.badRequest("No parameters provided"));

    // If the person is provided, search the user by username
    if (person) data = await UserRepository.findUserByUsername(person as string);

    // If the user_id is provided, search the user by user_id
    if (!person && user_id) data = await UserRepository.findUserById(user_id);

    // If the user is not found, return an error
    if (!data) return next(Exception.notFound("User not found"));

    
    const { PASSWORD, ...rest } = data;
    res.status(200).send({ user: rest });
  } catch (error: any) {  
    next(error);
  }
};

const searchUsersByQuery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;
    const data = await UserRepository.searchUsersByQuery(search as string);
    // If the user is not found, return an error
    if (!data?.length) return next(Exception.notFound("User not found"));
    res.status(200).send({ users: data });
  } catch (error) {
    next(error)
  }
};

const getRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const data = await UserRepository.getRecentSearches(user_id as unknown as number);
    return res.status(200).send({ users: data });
  } catch (error) {
    next(error)
  }
};

const saveRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, searched_id } = req.params;

    const data = await UserRepository.saveRecentSearches(
      user_id as unknown as number,
      searched_id as unknown as number
    );

    return res.status(200).send({ message: data });
  } catch (error) {
    next(error)
  }
};

const removeRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { recent_id } = req.params;
    const data = await UserRepository.deleteRecentSearches(recent_id as unknown as number);
    return res.status(200).send({ users: data });
  } catch (error) {
    next(error)
  }
};

const getFollowStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { followers, following } = await UserRepository.getFollowsStats(user_id as unknown as number);
    res.status(200).send({ followers, following });
  } catch (error) {
    next(error)
  }
};

const getFollowerFollowingLists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const { listsId } = req.body;
    const { fetch } = req.query;

    const data = await UserRepository.getFollowerFollowingLists(
      user_id as unknown as number,
      fetch as string,
      listsId as number[]
    );
    
    res.status(200).send({ lists: data });
  } catch (error:any) {
    next(error)
  }
}

const toggleFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { user_id, followed_id } = req.params;
    let result: string | undefined = undefined;

    const args = {
      follower_id: user_id as unknown as number,
      followed_id: followed_id as unknown as number,
    };
    
    // Check if the user is already following the other user
    const isExist = await UserRepository.isFollowUser(args);

    // If it already exists, delete the data from the database
    if (isExist) result = await UserRepository.unfollowUser(args);

    // if there is no data in the database, create one
    if (!isExist) result = await UserRepository.followUser(args);

    res.status(200).send({ message: result });
  } catch (error:any) {
    next(error)
  }
};

export {
  getUserData,
  searchUsersByQuery,
  saveRecentSearches,
  getRecentSearches,
  removeRecentSearches,
  getFollowStats,
  getFollowerFollowingLists,
  toggleFollow,
};
