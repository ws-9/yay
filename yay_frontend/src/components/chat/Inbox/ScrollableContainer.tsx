import { useRef, useState, useImperativeHandle, useEffect } from 'react';

type ScrollableContainerHandle = {
  scrollToBottom: () => void;
  isAtBottom: () => boolean;
};

export default function ScrollableContainer({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.Ref<ScrollableContainerHandle>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    },
    isAtBottom: () => isScrolledToBottom,
  }));

  // Add scroll event listener
  // Updates whether user is at the bottom
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsScrolledToBottom(atBottom);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollRef} className="overflow-y-auto">
      {children}
    </div>
  );
}
