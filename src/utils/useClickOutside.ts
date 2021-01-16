import React, { useEffect } from "react";

const useOutsideClick = (ref: React.RefObject<any>, callback: () => void) => {

  const handleClick = (e: MouseEvent) => {
    console.log(e.target);
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, false);

    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  }, []);
};

export default useOutsideClick;