import UsersService                        from "@/services/user/user.service.impl";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import FollowService                       from "@/services/follow/follow.service.impl";
import { SelectUsers }                     from "@/types/table.types";
import RecentSearchService                 from "@/services/recent-search/recent-search.service.impl";
import { NextFunction, Request, Response } from "express";

class UsersController {
  private userService: UsersService;
  private followService: FollowService;
  private recentSearchService: RecentSearchService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    userService: UsersService,
    followService: FollowService,
    recentSearchService: RecentSearchService
  ) {
    this.userService = userService;
    this.followService = followService;
    this.recentSearchService = recentSearchService;
  }

  public getUserData = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      let user: SelectUsers | undefined;
      const user_id = req.body.user_id;
      const person = req.query.person || "";

      if (person) {
        user = await this.userService.getUserByUsername(person as string);
      } else {
        user = await this.userService.getUserById(user_id);
      }

      res.status(200).send(user);
    }
  );

  public searchUsersByQuery = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const search = req.query.search;
      const users = await this.userService.searchUserByFields(search as string);
      res.status(200).send(users);
    }
  );

  public deleteUser = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id: any = req.params.user_id;
      const message = await this.userService.deleteUserById(user_id);
      res.status(200).send(message);
    }
  );

  public getFollowStats = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const stats = await this.followService.getFollowStats(user_id);
      res.status(200).send(stats);
    }
  );

  public getRecentSearches = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const searches = await this.recentSearchService
        .getAllRecentSearches(user_id);

      res.status(200).send(searches);
    }
  );

  public getFollowerFollowingLists = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const fetch = req.query.fetch;
      const listsId = req.body.listsId;

      const users = await this.followService.getFollowerFollowingLists(
        user_id,
        fetch as string,
        listsId
      );

      res.status(200).send(users);
    }
  );

  public toggleFollow = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const followed_id = req.params.followed_id;

      const message = await this.followService.toggleFollow(
        user_id,
        followed_id
      );

      res.status(200).send(message);
    }
  );

  public saveRecentSearches = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const search_user_id = req.params.searched_id;

      const message = await this.recentSearchService.saveRecentSearches(
        user_id,
        search_user_id
      );

      res.status(200).send(message);
    }
  );

  public removeRecentSearches = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
        const recent_id = req.params.recent_id;

        const message = await this.recentSearchService
          .removeRecentSearches(recent_id);

        res.status(200).send(message);
    }
  );
};

export default UsersController;