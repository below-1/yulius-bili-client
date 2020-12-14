import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';
import { get as getPosyandu } from './ListPosyandu.js';

export const CreateBalita = gql`
  mutation CreateBalita($payload: BalitaInput!) {
    createBalita(input: {
      balita: $payload
    }) {
      balita {
        id
      }
    }
  }
`;

export async function get() {
  const items = await getPosyandu('');
  return items.map(it => {
    return {
      value: it.id,
      text: it.nama
    }
  });
}

export async function post(payload) {
  const result = await apolloClient.mutate({
    mutation: CreateBalita,
    variables: { payload }
  })
  return result.data;
}