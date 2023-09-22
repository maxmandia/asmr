import { useState, useEffect } from "react";

const useScreenSize = (breakpoint = 540) => {
  // Safely access window only if it's defined
  const isClient = typeof window !== "undefined";

  const [isMobile, setIsMobile] = useState(
    isClient ? window.innerWidth < breakpoint : false,
  );

  useEffect(() => {
    // Exit early if we're server-rendering or the window object is not available
    if (!isClient) {
      return;
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint, isClient]); // Dependency array includes isClient to handle changes in client status

  return isMobile;
};

export default useScreenSize;
