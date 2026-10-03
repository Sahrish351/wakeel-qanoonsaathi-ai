import { useEffect, useState } from 'react';

/**
 * Debounces a value by the given delay in milliseconds.
 * The returned value only updates after the input value has remained
 * stable for `delay` ms. The timeout is cleared on unmount.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
