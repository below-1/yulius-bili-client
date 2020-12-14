import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const PosyanduById = gql`
  query PosyanduById($id: Int!) {
    posyanduById(id: $id) {
      id
      nama
    }
  }
`

export const UpdatePosyandu = gql`
  mutation UpdatePosyandu($id: Int!, $payload: PosyanduPatch!) {
    updatePosyanduById(input: {
      id: $id
      posyanduPatch: $payload
    }) {
      posyandu {
        id
      }
    }
  }
`

export async function get(id) {
  const result = await apolloClient.query({
    query: PosyanduById,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  return result.data.posyanduById;
}

export async function post({ id, payload }) {
  const result = await apolloClient.mutate({
    mutation: UpdatePosyandu,
    variables: {
      id,
      payload
    }
  })
  return result.data.updatePosyanduById.posyandu.id;
}

