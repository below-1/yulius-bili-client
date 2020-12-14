import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';

export const ListKategori = gql`
  query ListKategori {
    listKategori {
      nodes
    }
  }
`;

export const ListBahanPangan = gql`
  query ListBahanPangan ($kategori: String, $keyword: String!) {
    allBahanPangans (
      filter: {
        kategori: { equalTo: $kategori },
        nama: { likeInsensitive: $keyword }
      }
    ) {
      nodes {
        id
        beratMax
        beratMin
        kategori
        kebEnergi
        kebKarbohidrat
        kebLemak
        nama
        kebProtein
        urt
      }
    }
  }
`

export async function getKategori () {
  const result = await apolloClient.query({
    query: ListKategori,
    fetchPolicy: 'network-only'
  });
  return result.data.listKategori.nodes;
}

export async function get ({ keyword, kategori }) {
  const result = await apolloClient.query({
    query: ListBahanPangan,
    variables: {
      keyword: `%${keyword}%`,
      kategori
    },
    fetchPolicy: 'network-only'
  });
  return result.data.allBahanPangans.nodes;
}
