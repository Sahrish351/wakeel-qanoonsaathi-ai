import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Type-safe hook for reading and writing values to localStorage.
 * Supports cross-tab sync via the 'storage' event.
 * Falls back gracefully when localStorage is unavailable (e.g., private browsing).
 *
 * @param key - The localStorage key
 * @param initialValue - Fallback value when key is not set
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, () => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === 'undefined') return;
      try {
        const newValue =
          typeof value === 'function'
            ? (value as (prev: T) => T)(storedValue)
            : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        // Dispatch a custom event so other hook instances on the same page update
        window.dispatchEvent(new StorageEvent('storage', { key }));
      } catch (error) {
        console.warn(`[useLocalStorage] Failed to write key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new StorageEvent('storage', { key }));
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs / other hook instances
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === key) {
        setStoredValue(readValue());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}
