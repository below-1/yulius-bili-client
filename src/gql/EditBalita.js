import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const BalitaById = gql`
  query BalitaById($id: Int!) {
    balitaById(id: $id) {
      bb
      id
      idPosyandu
      jk
      nama
      tb
      usia
    }
  }
`

export const UpdateBalita = gql`
  mutation UpdateBalita($id: Int!, $payload: BalitaPatch!) {
    updateBalitaById(input: {
      id: $id
      balitaPatch: $payload
    }) {
      balita {
        id
      }
    }
  }
`

export async function get(id) {
  const result = await apolloClient.query({
    query: BalitaById,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  return result.data.balitaById;
}

export async function post({ id, payload }) {
  const result = await apolloClient.mutate({
    mutation: UpdateBalita,
    variables: {
      id,
      payload
    }
  })
  return result.data.updateBalitaById.balita.id;
}

