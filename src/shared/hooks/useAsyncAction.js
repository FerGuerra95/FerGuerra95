import { useCallback, useState } from 'react';

export function useAsyncAction(action) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      return await action(...args);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [action]);

  return { run, isLoading, error };
}
