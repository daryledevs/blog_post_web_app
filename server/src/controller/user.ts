import Exception                           from "../exception/exception";
import UserRepository                      from "../repository/user-repository";
import { SelectUsers }                     from "../types/table.types";
import FollowRepository                    from "../repository/follow-repository";
import RecentSearchesRepository            from "../repository/recent-searches-repository";
import { NextFunction, Request, Response } from "express";

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const { person } = req.query;

    let data: SelectUsers | undefined;

    // If no parameters are provided, return an error
    if(!user_id && !person) return next(Exception.badRequest("No parameters provided"));

    // If the person is provided, search the user by username
    if (person) data = await UserRepository.findUserByUsername(person as string);

    // If the user_id is provided, search the user by user_id
    if (!person && user_id) data = await UserRepository.findUserById(user_id);

    // If the user is not found, return an error
    if (!data) return next(Exception.notFound("User not found"));
    
    const { password, ...rest } = data;
    res.status(200).send({ user: rest });
  } catch (error: any) {  
    next(error);
  };
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
  };
};

const getRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id: any = req.params.user_id;
    const data = await RecentSearchesRepository.getRecentSearches(user_id);
    return res.status(200).send({ users: data });
  } catch (error) {
    next(error)
  };
};

const saveRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, searched_id } = req.params;

    // Check if the user is already saved
    const isRecentExists = await RecentSearchesRepository.findUsersSearchByUserId(
      user_id as unknown as number,
      searched_id as unknown as number
    );

    // If the user is already saved, return an error
    if (isRecentExists) return next(Exception.badRequest("User already saved"));
    
    const data = await RecentSearchesRepository.saveRecentSearches(
      user_id as unknown as number,
      searched_id as unknown as number
    );

    return res.status(200).send({ message: data });
  } catch (error) {
    next(error)
  };
};

const removeRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recent_id: any = req.params.recent_id;

    // Check if the user exists
    const recent = await RecentSearchesRepository.findUsersSearchByRecentId(recent_id);

    // If the user does not exist, return an error
    if (recent) return next(Exception.notFound("User not found"));

    const data = await RecentSearchesRepository.deleteRecentSearches(recent_id);
    return res.status(200).send({ users: data });
  } catch (error) {
    next(error)
  };
};

const getFollowStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id: any = req.params.user_id;
    const { followers, following } = await FollowRepository.getFollowsStats(user_id);
    res.status(200).send({ followers, following });
  } catch (error) {
    next(error)
  }
};

const getFollowerFollowingLists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id: any = req.params.user_id;
    const listsId: number[] = req.body.listsId;
    const fetch: any = req.query.fetch;

    const data = await FollowRepository.getFollowerFollowingLists(
      user_id,
      fetch,
      listsId
    );
    
    res.status(200).send({ lists: data });
  } catch (error:any) {
    next(error)
  };
};

const toggleFollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { user_id, followed_id } = req.params;
    let result: string | undefined = undefined;

    const args = {
      follower_id: user_id as unknown as number,
      followed_id: followed_id as unknown as number,
    };
    
    // Check if the user is already following the other user
    const isExist = await FollowRepository.isFollowUser(args);

    // If it already exists, delete the data from the database
    if (isExist) result = await FollowRepository.unfollowUser(args);

    // if there is no data in the database, create one
    if (!isExist) result = await FollowRepository.followUser(args);

    res.status(200).send({ message: result });
  } catch (error:any) {
    next(error)
  };
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
