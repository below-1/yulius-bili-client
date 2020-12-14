import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const BahanPanganById = gql`
  query BahanPanganById($id: Int!) {
    bahanPanganById(id: $id) {
      beratMax
      beratMin
      kebEnergi
      kebKarbohidrat
      kategori
      id
      kebLemak
      kebProtein
      nama
      urt
    }
  }
`;

export const UpdateBahanPangan = gql`
  mutation UpdateBahanPangan ($id: Int!, $payload: BahanPanganPatch!) {
    updateBahanPanganById(input: {
      id: $id
      bahanPanganPatch: $payload
    }) {
      bahanPangan {
        id
      }
    }
  }
`

export async function get (id) {
  const result = await apolloClient.query({
    query: BahanPanganById,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  });
  return result.data.bahanPanganById;
}

export async function post ({ id, payload }) {
  const result = await apolloClient.mutate({
    mutation: UpdateBahanPangan,
    variables: {
      id,
      payload
    }
  });
  return result.data.updateBahanPanganById.bahanPangan.id;
}
