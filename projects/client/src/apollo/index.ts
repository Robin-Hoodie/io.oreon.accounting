import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client/core";

const constructApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const link = createHttpLink({
    uri: process.env.VUE_APP_API_BASE_URL
  });
  const cache = new InMemoryCache();
  return new ApolloClient({
    link,
    cache,
    connectToDevTools: process.env.NODE_ENV === "development"
  });
};

export const getDefaultApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  return constructApolloClient();
};

