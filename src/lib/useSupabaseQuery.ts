'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseSupabaseQueryOptions<TMock, TApi> {
  /** Async function that fetches from API/Supabase */
  queryFn: () => Promise<TApi>;
  /** Static mock data to use as fallback */
  mockData: TMock;
  /** Transform API data to match mock shape (optional if shapes match) */
  transform?: (apiData: TApi) => TMock;
  /** Whether to skip the query entirely (use mock directly) */
  skip?: boolean;
}

interface UseSupabaseQueryResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isUsingMock: boolean;
}

/**
 * Hook that attempts to fetch from Supabase/API, falling back to mock data
 * if the fetch fails or Supabase is not configured.
 */
export function useSupabaseQuery<TMock, TApi = TMock>({
  queryFn,
  mockData,
  transform,
  skip = false,
}: UseSupabaseQueryOptions<TMock, TApi>): UseSupabaseQueryResult<TMock> {
  const [data, setData] = useState<TMock>(mockData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMock, setIsUsingMock] = useState(true);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (skip) return;

    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      if (!mountedRef.current) return;

      const transformed = transform ? transform(result) : (result as unknown as TMock);

      // Use API data if the fetch succeeded (even if it's an empty array)
      if (transformed === null || transformed === undefined) {
        setData(mockData);
        setIsUsingMock(true);
      } else {
        setData(transformed);
        setIsUsingMock(false);
      }
    } catch {
      if (!mountedRef.current) return;
      // Graceful fallback to mock data — error is NOT surfaced to avoid
      // showing error states when mock data is perfectly usable
      setData(mockData);
      setIsUsingMock(true);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [queryFn, mockData, transform, skip]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, isUsingMock };
}

/**
 * Check if Supabase environment variables are configured.
 * Used to skip API calls entirely when not configured.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
