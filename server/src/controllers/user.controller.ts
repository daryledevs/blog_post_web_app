import UserDto                             from "@/dto/user.dto";
import AsyncWrapper                        from "@/utils/async-wrapper.util";
import IEUserService                       from "@/services/user/user.service";
import IEFollowService                     from "@/services/follow/follow.service";
import IESearchHistoryService              from "@/services/search-history/search-history.service";
import { NextFunction, Request, Response } from "express";

class UsersController {
  private userService:          IEUserService;
  private followService:        IEFollowService;
  private searchHistoryService: IESearchHistoryService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    userService:          IEUserService,
    followService:        IEFollowService,
    searchHistoryService: IESearchHistoryService
  ) {
    this.userService = userService;
    this.followService = followService;
    this.searchHistoryService = searchHistoryService;
  }

  public getUserData = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      let user: UserDto | undefined;
      const uuid = req.body.uuid;
      const person  = req.query.person || "";

      if (person) {
        user = await this.userService.getUserByUsername(person as string);
      } else {
        user = await this.userService.getUserById(uuid);
      };

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
      const id = req.params.id;
      const message = await this.userService.deleteUserById(id);
      res.status(200).send(message);
    }
  );

  public getFollowStats = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const uuid = req.params.uuid;
      const stats = await this.followService.getFollowStats(uuid);
      res.status(200).send(stats);
    }
  );

  public getFollowerFollowingLists = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const id      = req.params.id;
      const fetch   = req.query.fetch;
      const listsId = req.body.listsId;

      const stats = await this.followService.getFollowerFollowingLists(
        id,
        fetch as string,
        listsId
      );

      res.status(200).send(stats);
    }
  );

  public toggleFollow = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const follower_uuid = req.params.follower_uuid;
      const followed_uuid = req.params.followed_uuid;

      const message = await this.followService.toggleFollow(
        follower_uuid,
        followed_uuid
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

      const messages = await this.searchHistoryService.saveUsersSearch(
        searcher_uuid,
        search_uuid
      );

      res.status(200).send(messages);
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