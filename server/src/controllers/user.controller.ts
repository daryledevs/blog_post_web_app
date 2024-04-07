import UsersService                        from "@/services/user/user.service.impl";
import FollowService                       from "@/services/follow/follow.service.impl";
import { SelectUsers }                     from "@/types/table.types";
import RecentSearchService                 from "@/services/recent-search/recent-search.service.impl";
import { NextFunction, Request, Response } from "express";

class UsersController {
  private userService: UsersService;
  private followService: FollowService;
  private recentSearchService: RecentSearchService;

  constructor(
    userService: UsersService,
    followService: FollowService,
    recentSearchService: RecentSearchService,
  ) {
    this.userService = userService;
    this.followService = followService;
    this.recentSearchService = recentSearchService;
  }

  public getUserData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user: SelectUsers | undefined;
      const user_id = req.body.user_id;
      const person = req.query.person || "";

      if (person) {
        user = await this.userService.getUserByUsername(person as string);
      } else {
        user = await this.userService.getUserById(user_id);
      };

      res.status(200).send(user);
    } catch (error) {
      next(error);
    };
  };

  public searchUsersByQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = req.query.search;
      const users = await this.userService.searchUserByFields(search as string);
      res.status(200).send(users);
    } catch (error) {
      next(error);
    };
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id: any = req.params.user_id;
      const message = await this.userService.deleteUserById(user_id);
      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };

  public getFollowStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const stats = await this.followService.getFollowStats(user_id);
      res.status(200).send(stats);
    } catch (error) {
      next(error);
    };
  };

  public getRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const searches = await this.recentSearchService.getAllRecentSearches(user_id);
      res.status(200).send(searches);
    } catch (error) {
      next(error);
    };
  };

  public getFollowerFollowingLists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const fetch = req.query.fetch;
      const listsId = req.body.listsId;

      const users = await this.followService.getFollowerFollowingLists(
        user_id,
        fetch as string,
        listsId
      );

      res.status(200).send(users);
    } catch (error) {
      next(error);
    };
  };

  public toggleFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const followed_id = req.params.followed_id;

      const message = await this.followService
        .toggleFollow(user_id, followed_id);
        
      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };

  public saveRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = req.params.user_id;
      const search_user_id = req.params.searched_id;

      const message = await this.recentSearchService
        .saveRecentSearches(user_id, search_user_id);

      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };

  public removeRecentSearches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recent_id = req.params.recent_id;

      const message = await this.recentSearchService
        .removeRecentSearches(recent_id);

      res.status(200).send(message);
    } catch (error) {
      next(error);
    };
  };
};

export default UsersController;