import { useState, useRef } from "react";

const useTimer = ({ duration, callback }) => {
  const [isActive, setIsActive] = useState(false);
  const countRef = useRef(null);

  const handleStart = () => {
    setIsActive(true);
    countRef.current = setTimeout(() => {
      callback();
    }, duration);
  };

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
  };

  return {
    isActive,
    handleStart,
    handleReset,
  };
};

export default useTimer;
