import { useEffect, useState } from 'react';

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  count,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(true);
  const [loading, setLoading] = useState(false);
  console.log("in useChatScroll shouldLoadMore =>" + shouldLoadMore);
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      //console.log("in handle scroll");
      if (scrollTop === 0 && shouldLoadMore) {
        setLoading(true);
        if(loading){
          setLoading(false);
          loadMore();
          console.log("in handle scroll loadMore will called");
          
          setTimeout(() => {
            setLoading(true);
          }, 1000);
        }
        
      }
    };
    console.log("top div => " + topDiv?.scrollHeight + " client height => " + topDiv?.clientHeight);
    topDiv?.addEventListener('wheel', handleScroll);

    return () => {
      console.log("in return");
      topDiv?.removeEventListener('scroll', handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef,loading]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
        });
      });
    }

    return () => {};
  }, [bottomRef, chatRef, count, hasInitialized]);
};
