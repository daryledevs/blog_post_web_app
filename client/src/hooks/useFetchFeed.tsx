import { useEffect, useState } from "react";
import { IPost } from "../interfaces/interface";
import { IEUserFeed } from "@/redux/api/feedApi";

type useFetchFeedProps = {
  userUuid: string | undefined;
  addFeedTrigger: string;
  userFeedApi: any;
  setFeeds: React.Dispatch<React.SetStateAction<{ feed: IPost[] }>>;
  fetchUserFeed: ({ userUuid, postUuids }: IEUserFeed) => void;
  setAddFeedTrigger: React.Dispatch<React.SetStateAction<string>>;
};

function useFetchFeed({
  userUuid,
  userFeedApi,
  addFeedTrigger,
  setFeeds,
  fetchUserFeed,
  setAddFeedTrigger,
}: useFetchFeedProps) {
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (userUuid && isPageRefresh && userFeedApi.status === "uninitialized") {
      fetchUserFeed({ userUuid: userUuid, postUuids: [] });
      sessionStorage.setItem("lastTime", new Date().toString());
      setIsPageRefresh(false);
      return;
    }

    if (!userFeedApi.data) return;
    setFeeds((prev: any) => ({
      feed: [...prev?.feed, ...userFeedApi?.data?.feed],
    }));
    setAddFeedTrigger("not triggered yet");
  }, [addFeedTrigger, userFeedApi]);
}

export default useFetchFeed;
