import { useEffect, useState } from "react";

export const useLocalStorage = <T>(
  storageKey: string,
  fallbackState: T
): [T, (t: T) => void, () => void] => {
  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem(storageKey) ?? "null") ?? fallbackState
  );

  const reload = () => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    } else {
      setValue(fallbackState);
    }
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue, reload];
};
