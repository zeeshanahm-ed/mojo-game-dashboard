const cacheTime = 0; // disable cache
const staleTime = 0; // always stale

export default {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime,
      staleTime,
    },
  },
};
