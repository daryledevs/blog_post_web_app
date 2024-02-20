import { useEffect, useState } from 'react'
import { IEPost } from '../interfaces/interface';

type useFetchFeedProps = {
  addFeedTrigger: string;
  getUserFeedApi: any;
  setFeeds: React.Dispatch<React.SetStateAction<{ feed: IEPost[] }>>;
  getUserFeed: ({ post_ids }: { post_ids: number[] }) => void;
};

function useFetchFeed({
  getUserFeedApi,
  addFeedTrigger,
  setFeeds, 
  getUserFeed,
}: useFetchFeedProps) {
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(true);

  useEffect(() => {
    const currentTime = new Date();
    const lastTime = sessionStorage.getItem("lastTime") || 0;
    const timeDifference = Math.abs(currentTime.getTime() - new Date(lastTime).getTime());
    const minutesDifference = Math.floor(timeDifference / 1000 / 60);
    const isGreaterThanThreeMinutes = minutesDifference >= 3;

    if (!lastTime) {
      getUserFeed({ post_ids: [] });
      sessionStorage.setItem("lastTime", new Date().toString());
      return;
    }

    if (isGreaterThanThreeMinutes) {
      getUserFeed({ post_ids: [] });
      sessionStorage.setItem("lastTime", new Date().toString());
      return;
    }

    if(isPageRefresh) {
      getUserFeed({ post_ids: [] });
      sessionStorage.setItem("lastTime", new Date().toString());
      setIsPageRefresh(false);
      return;
    }
    
    if (!getUserFeedApi.data) return;
    setFeeds((prev: any) => {
      return { feed: [...prev.feed, ...getUserFeedApi.data?.feed] };
    });
  }, [addFeedTrigger, getUserFeedApi.data]);
}

export default useFetchFeed
