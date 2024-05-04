import { useEffect, useState } from "react";
import { IEPost } from "../interfaces/interface";
import { IEUserFeed } from "@/redux/api/feedApi";

type useFetchFeedProps = {
  user_id: number;
  addFeedTrigger: string;
  userFeedApi: any;
  setFeeds: React.Dispatch<React.SetStateAction<{ feed: IEPost[] }>>;
  fetchUserFeed: ({ user_id, post_ids }: IEUserFeed) => void;
  setAddFeedTrigger: React.Dispatch<React.SetStateAction<string>>;
};

function useFetchFeed({
  user_id,
  userFeedApi,
  addFeedTrigger,
  setFeeds,
  fetchUserFeed,
  setAddFeedTrigger,
}: useFetchFeedProps) {
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (user_id && isPageRefresh && userFeedApi.status === "uninitialized") {
      fetchUserFeed({ user_id: user_id, post_ids: [] });
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
