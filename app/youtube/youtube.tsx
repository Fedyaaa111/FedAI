import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {

  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);

      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
    }

    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}