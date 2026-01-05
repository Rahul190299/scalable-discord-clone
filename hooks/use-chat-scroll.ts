import { useEffect, useRef, useState } from 'react';

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
  const prevScrollHeightRef = useRef(0);
  console.log("count => " + count);
  //console.log("in useChatScroll shouldLoadMore =>" + shouldLoadMore);
  useEffect(() => {
     
    const topDiv = chatRef?.current;
    console.log(topDiv);
    const handleScroll = () => {
      
      const scrollTop = topDiv?.scrollTop;
      console.log("scrollTop" + scrollTop);
      console.log("in handle scroll");
      if (scrollTop === 0 && shouldLoadMore) {
        // Save current scroll height before DOM updates
        const prevScrollHeight = topDiv?.scrollHeight;
        if(prevScrollHeight){
          prevScrollHeightRef.current = prevScrollHeight;
        }
        loadMore();
        //console.log("in handle scroll loadMore will called");
        
      }
    };
    //console.log("top div => " + topDiv?.scrollTop + " client height => " + topDiv?.clientHeight);
    if(topDiv != null){
       //console.log("added scroll event");
       topDiv.addEventListener('scroll', handleScroll);
    }
    

    return () => {
      console.log("in return");
      topDiv?.removeEventListener('scroll', handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef,loading]);

  useEffect(() => {
    const chat = chatRef?.current;
    console.log("in ue2");
    if (!chat) return;
    console.log("in useeffect");

    // Adjust scroll to keep view stable
    const newScrollHeight = chat.scrollHeight;
    const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
    chat.scrollTop = scrollDiff;
    console.log("scroollDif =>" + scrollDiff);
  }, [shouldLoadMore,chatRef]); // run after messages change
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
