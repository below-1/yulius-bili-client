import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const CreatePosyandu = gql`
  mutation CreatePosyandu ($payload: PosyanduInput!) {
    createPosyandu (input: {
      posyandu: $payload
    }) {
      posyandu {
        id
      }
    }
  }
`;

export async function post (payload) {
  const result = await apolloClient.mutate({
    mutation: CreatePosyandu,
    variables: {
      payload
    }
  })
  return result
}
