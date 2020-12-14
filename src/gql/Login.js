import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const Login = gql`
  mutation Login($username: String!, $password: String!) {
    login (input: {
      _username: $username,
      _password: $password
    }) {
      token: appUserJwt
    }
  }
`;

export async function post ({ username, password }) {
  const result = await apolloClient.mutate({
    mutation: Login,
    variables: {
      username,
      password
    }
  })
  const token = result.data.login.token;
  localStorage.setItem('enjel.token', token);
}