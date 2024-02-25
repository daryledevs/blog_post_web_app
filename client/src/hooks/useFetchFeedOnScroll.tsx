import {useEffect } from 'react'

function useFetchFeedOnScroll({
  feedRef,
  feeds,
  fetchUserFeed,
  userTotalFeedApi,
  setAddFeedTrigger,
}: any) {
  useEffect(() => {
    const isBottom = (element: any) => {
      return element.scrollHeight - element.scrollTop === element.clientHeight;
    };

    const onScroll: EventListener = (event: Event) => {
      if (isBottom(feedRef.current)) {
        const feedLength = feeds.feed?.length ?? 0;
        // The purpose is to prevent the website to request every single time
        if (userTotalFeedApi.data?.count > feedLength) {
          userTotalFeedApi.refetch()
          const getIds = feeds.feed?.map((post: any) => post.post_id);
          fetchUserFeed({ post_ids: [...getIds] });
          setAddFeedTrigger("triggered");
        }
      }
    };

    const currentFeedRef = feedRef.current;
    currentFeedRef?.addEventListener("scroll", onScroll);
    return () => currentFeedRef?.removeEventListener("scroll", onScroll);
    // Put userFeed here to let this handler know
    // that it has a new data update.
  }, [feedRef.current, feeds.feed]);
}

export default useFetchFeedOnScroll
