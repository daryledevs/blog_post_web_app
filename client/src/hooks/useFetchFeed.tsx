import { useEffect, useState } from 'react'
import { IEPost } from '../interfaces/interface';

type useFetchFeedProps = {
  addFeedTrigger: string;
  userFeedApi: any;
  setFeeds: React.Dispatch<React.SetStateAction<{ feed: IEPost[] }>>;
  fetchUserFeed: ({ post_ids }: { post_ids: number[] }) => void;
  setAddFeedTrigger: React.Dispatch<React.SetStateAction<string>>;
};

function useFetchFeed({
  userFeedApi,
  addFeedTrigger,
  setFeeds, 
  fetchUserFeed,
  setAddFeedTrigger
}: useFetchFeedProps) {
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (isPageRefresh && userFeedApi.status === "uninitialized") {
      fetchUserFeed({ post_ids: [] });
      sessionStorage.setItem("lastTime", new Date().toString());
      setIsPageRefresh(false);
      return;
    }
    
    if(!userFeedApi.data) return;
    setFeeds((prev: any) => ({ feed: [...prev?.feed, ...userFeedApi?.data?.feed] }));
    setAddFeedTrigger("not triggered yet");
  }, [addFeedTrigger, userFeedApi]);
}

export default useFetchFeed
