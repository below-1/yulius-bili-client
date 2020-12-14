import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const ListPosyandu = gql`
  query AllPosyandus($keyword: String!) {
    allPosyandus(filter: {nama: {likeInsensitive: $keyword}}) {
      nodes {
        nama
        id
        balitas: balitasByIdPosyandu {
          total: totalCount
        }
      }
    }
  }
`

export async function get (keyword) {
  const result = await apolloClient.query({
    query: ListPosyandu,
    variables: {
      keyword: `%${keyword}%`
    },
    fetchPolicy: 'network-only'
  })
  const items = result.data.allPosyandus.nodes;
  return items;
}