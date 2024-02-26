import { useEffect, useState } from 'react'
import { IEPost } from '../interfaces/interface';

type useFetchFeedProps = {
  addFeedTrigger: string;
  userFeedApi: any;
  setFeeds: React.Dispatch<React.SetStateAction<{ feed: IEPost[] }>>;
  fetchUserFeed: ({ post_ids }: { post_ids: number[] }) => void;
};

function useFetchFeed({
  userFeedApi,
  addFeedTrigger,
  setFeeds, 
  fetchUserFeed,
}: useFetchFeedProps) {
  const [isPageRefresh, setIsPageRefresh] = useState<boolean>(true);

  useEffect(() => {
    if(userFeedApi.isLoading || !userFeedApi.data) return;
    
    if(isPageRefresh) {
      fetchUserFeed({ post_ids: [] });
      sessionStorage.setItem("lastTime", new Date().toString());
      setIsPageRefresh(false);
      return;
    }
  
    setFeeds((prev: any) => {
      return { feed: [...prev?.feed, ...userFeedApi.data?.feed] };
    });
  }, [addFeedTrigger, userFeedApi]);
}

export default useFetchFeed
