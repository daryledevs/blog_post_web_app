import AsyncWrapper                        from "@/utils/async-wrapper.util";
import FollowService                       from "@/services/follow/follow.service.impl";
import IEUserService                       from "@/services/user/user.service";
import { SelectUsers }                     from "@/types/table.types";
import IESearchHistoryService              from "@/services/search-history/search-history.service";
import { NextFunction, Request, Response } from "express";

class UsersController {
  private userService: IEUserService;
  private followService: FollowService;
  private searchHistoryService: IESearchHistoryService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    userService: IEUserService,
    followService: FollowService,
    searchHistoryService: IESearchHistoryService
  ) {
    this.userService = userService;
    this.followService = followService;
    this.searchHistoryService = searchHistoryService;
  }

  public getUserData = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      let user: SelectUsers | undefined;
      const uuid = req.body.uuid;
      const person  = req.query.person || "";

      if (person) {
        user = await this.userService.getUserByUsername(person as string);
      } else {
        user = await this.userService.getUserById(uuid);
      }

      res.status(200).send({ user });
    }
  );

  public searchUsersByQuery = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const search: any = req.query.search;
      const users = await this.userService.searchUserByFields(search);
      res.status(200).send({ users });
    }
  );

  public deleteUser = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const message = await this.userService.deleteUserById(user_id);
      res.status(200).send(message);
    }
  );

  public getFollowStats = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const stats   = await this.followService.getFollowStats(user_id);
      res.status(200).send(stats);
    }
  );

  public getFollowerFollowingLists = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const user_id = req.params.user_id;
      const fetch   = req.query.fetch;
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
      const user_id     = req.params.user_id;
      const followed_id = req.params.followed_id;

      const message = await this.followService.toggleFollow(
        user_id,
        followed_id
      );

      res.status(200).send(message);
    }
  );
  
  public getSearchHistory = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const searcher_uuid = req.params.searcher_uuid;

      const searches = await this.searchHistoryService
        .getUsersSearchHistoryById(searcher_uuid);

      res.status(200).send(searches);
    }
  );

  public saveRecentSearches = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const searcher_uuid = req.params.searcher_uuid;
      const search_uuid   = req.params.search_uuid;

      const message = await this.searchHistoryService.saveUsersSearch(
        searcher_uuid,
        search_uuid
      );

      res.status(200).send(message);
    }
  );

  public removeRecentSearches = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const uuid = req.params.uuid;

      const message = await this.searchHistoryService
        .removeRecentSearchesById(uuid);

      res.status(200).send(message);
    }
  );
};

export default UsersController;