import { 
  ApolloClient, 
  HttpLink, 
  ApolloLink, 
  InMemoryCache, 
  defaultDataIdFromObject
} from '@apollo/client/core';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

export default new ApolloClient({
  cache,
  link: httpLink
});
