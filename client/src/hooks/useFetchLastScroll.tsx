import { useEffect } from 'react'

type useFetchLastScrollProps = {
  feedRef: React.RefObject<HTMLDivElement>;
  feeds: { feed: any[] };
};

function useFetchLastScroll({ feedRef, feeds }: useFetchLastScrollProps) {

  useEffect(() => {
    requestAnimationFrame(() => {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      feedRef.current?.scrollTo(0, parseInt(scrollPosition ?? "0"));
    });
    
    const onScroll: EventListener = (event: Event) => {
      sessionStorage.setItem(
        "scrollPosition",
        feedRef.current?.scrollTop?.toString() ?? ""
      );
    };

    const currentFeedRef = feedRef.current;
    currentFeedRef?.addEventListener("scroll", onScroll);
    return () => currentFeedRef?.removeEventListener("scroll", onScroll);
  }, [feedRef.current, feeds.feed]);
}

export default useFetchLastScroll
