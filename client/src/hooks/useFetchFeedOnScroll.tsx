import { useState, useEffect } from 'react'

function useFetchFeedOnScroll({ feedRef, feeds, getTotalFeed, getUserFeed, totalFeedApiData }: any) {
  
  const [noPostTrigger, setNoPostTrigger] = useState<boolean>(false);
  const [addFeedTrigger, setAddFeedTrigger] = useState<string>("not triggered yet");

  function getMinutes() {
    const lastRequest = sessionStorage.getItem("lastRequest");
    const last = lastRequest ? new Date(lastRequest) : null;
    const current = new Date();
    const diff = last ? Math.abs(last.valueOf() - current.valueOf()) : 0;
    return Math.floor(diff / 1000 / 60);
  }

  useEffect(() => {
    const isBottom = (element: any) => {
      return element.scrollHeight - element.scrollTop === element.clientHeight;
    };

    const onScroll: EventListener = (event: Event) => {
      const lastRequest = sessionStorage.getItem("lastRequest");
      if (isBottom(feedRef.current)) {
        const feedLength = feeds.feed?.length ?? 0;
        // The purpose is to prevent the website to request every single time
        if (totalFeedApiData?.count > feedLength && !noPostTrigger) {
          getTotalFeed({});
          const getIds = feeds.feed?.map((post: any) => post.post_id);
          getUserFeed({ post_ids: [...getIds] });
          setAddFeedTrigger("triggered");
        } else {
          const minutes = getMinutes();
          if (lastRequest && minutes < 5) return setNoPostTrigger(true);
          const value = new Date();
          sessionStorage.setItem("lastRequest", value.getTime().toString());
        }
      }
    };

    const currentFeedRef = feedRef.current;
    currentFeedRef?.addEventListener("scroll", onScroll);
    return () => currentFeedRef?.removeEventListener("scroll", onScroll);

    // Put userFeed here to let this handler know
    // that it has a new data update.
  }, [feeds.feed, totalFeedApiData?.count]);

  return { addFeedTrigger };
}

export default useFetchFeedOnScroll
