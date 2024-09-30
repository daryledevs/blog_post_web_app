import UserDto                   from "@/domain/dto/user.dto";
import FollowerDto               from "@/domain/dto/follower.dto";
import FollowingDto              from "@/domain/dto/following.dto";
import IEUserService             from "@/application/services/user/user.service";
import IEFollowService           from "@/application/services/follow/follow.service";
import { Request, Response }     from "express";
import IESearchHistoryService    from "@/application/services/search-history/search-history.service";
import { IFollower, IFollowing } from "@/domain/types/follower.interface";

class UsersController {
  private userService: IEUserService;
  private followService: IEFollowService;
  private searchHistoryService: IESearchHistoryService;

  constructor(
    userService: IEUserService,
    followService: IEFollowService,
    searchHistoryService: IESearchHistoryService
  ) {
    this.userService = userService;
    this.followService = followService;
    this.searchHistoryService = searchHistoryService;
  }

  public getUserData = async (req: Request, res: Response) => {
    let user: UserDto | undefined;
    const uuid = req.session?.user?.uuid;
    const username = req.query.username || "";

    if (username) {
      user = await this.userService.getUserByUsername(username as string);
    } else {
      user = await this.userService.getUserById(uuid);
    }

    res.status(200).send({ user: user?.getUsers() });
  };

  public searchUsersByQuery = async (req: Request, res: Response) => {
    const searchQuery: any = req.query.searchQuery;
    const users = await this.userService.searchUserByFields(searchQuery);
    const usersList = users.map((user) => user.getUsers());
    res.status(200).send({ users: usersList });
  };

  public deleteUser = async (req: Request, res: Response) => {
    const uuid = req.params.uuid;
    const message = await this.userService.deleteUserById(uuid);
    res.status(200).send({ message });
  };

  public getFollowStats = async (req: Request, res: Response) => {
    const uuid = req.params.uuid!;
    const stats = await this.followService.getFollowStats(uuid);
    res.status(200).send(stats);
  };

  public getFollowerFollowingLists = async (req: Request, res: Response) => {
    const uuid = req.params.uuid!;
    const fetchFollowType = req.query.fetchFollowType;
    const followIds = req.body.followIds;

    const followLists = await this.followService.getFollowerFollowingLists(
      uuid,
      fetchFollowType as string,
      followIds
    );

    let followList: IFollower[] | IFollowing[] = [];

    if (fetchFollowType === "followers") {
      // Type assertion is used to convert the type of the followLists array to FollowerDto[]
      followList = (followLists as FollowerDto[]).map((follower: FollowerDto) =>
        follower.getFollowers()
      ) as unknown as IFollower[];
    } else {
      // Type assertion is used to convert the type of the followLists array to FollowingDto[]
      followList = (followLists as FollowingDto[]).map(
        (follower: FollowingDto) => follower.getFollowing()
      ) as unknown as IFollowing[];
    }

    res.status(200).send({ followList });
  };

  public toggleFollow = async (req: Request, res: Response) => {
    const followerUuid = req.params.followerUuid!;
    const followedUuid = req.params.followedUuid!;

    const message = await this.followService.toggleFollow(
      followerUuid,
      followedUuid
    );

    res.status(200).send(message);
  };

  public getSearchHistory = async (req: Request, res: Response) => {
    const searcherUuid = req.params.searcherUuid!;

    const searches = await this.searchHistoryService.getUsersSearchHistoryById(
      searcherUuid
    );

    const searchesList = searches.map((search) => search?.getSearchHistories());

    res.status(200).send({ searches: searchesList });
  };

  public saveRecentSearches = async (req: Request, res: Response) => {
    const searcherUuid = req.params.searcherUuid!;
    const searchedUuid = req.params.searchedUuid!;

    const message = await this.searchHistoryService.saveUsersSearch(
      searcherUuid,
      searchedUuid
    );

    res.status(200).send({ message });
  };

  public removeRecentSearches = async (req: Request, res: Response) => {
    const uuid = req.params.uuid!;

    const message = await this.searchHistoryService.removeRecentSearchesById(
      uuid
    );

    res.status(200).send(message);
  };
};

export default UsersController;