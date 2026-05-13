import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {

  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(key);

    if (stored) {
      setValue(JSON.parse(stored));
    }

    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, ready, key]);

  return [value, setValue];
}
