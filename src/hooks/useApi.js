import { useState, useEffect, useCallback } from "react";

// Hook for handling API calls with loading, error, and data states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Hook for async API operations (like form submissions)
export const useAsyncApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err);
      console.error("API Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { execute, loading, error, clearError };
};

// Hook for paginated API calls
export const usePaginatedApi = (apiCall, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(
    async (pageNumber = 1, append = false) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiCall(pageNumber, pageSize);

        if (append) {
          setData((prev) => [...prev, ...result.data]);
        } else {
          setData(result.data);
        }

        setHasMore(result.data.length === pageSize);
        setPage(pageNumber);
      } catch (err) {
        setError(err);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, pageSize]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(page + 1, true);
    }
  }, [loading, hasMore, page, fetchData]);

  const refresh = useCallback(() => {
    fetchData(1, false);
  }, [fetchData]);

  useEffect(() => {
    fetchData(1, false);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    page,
  };
};

// Hook for real-time data updates
export const useRealtimeApi = (apiCall, interval = 5000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
