import React, { useEffect } from "react";

interface ICLickOutside{
  ref: React.RefObject<any>;
  callback: () => void;
}

const useOutsideClick = ({ref, callback}: ICLickOutside) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;