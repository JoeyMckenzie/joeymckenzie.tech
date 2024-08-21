import { createDrizzleClient } from '~~/database/client';

export function useDb() {
  const { tursoAuthToken: authToken, tursoDatabaseUrl: url } = useRuntimeConfig();
  return createDrizzleClient(authToken, url);
}
