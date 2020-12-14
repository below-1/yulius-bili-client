import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const CreateBahanPangan = gql`
  mutation CreateBahanPangan($payload: BahanPanganInput!) {
    createBahanPangan(input: {
      bahanPangan: $payload
    }) {
      bahanPangan {
        id
      }
    }
  }
`;

export async function post(payload) {
  const result = await apolloClient.mutate({
    mutation: CreateBahanPangan,
    variables: { payload }
  })
  return result.data;
}