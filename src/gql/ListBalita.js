import apolloClient from 'enjel/apolloClient.js';
import { gql } from '@apollo/client/core';
import { get as getPosyandu } from './ListPosyandu.js';

export const ListBalita = gql`
  query ListBalita($keyword: String, $idPosyandu: Int) {
    allBalitas(filter: 
      {
        nama: {likeInsensitive: $keyword}, 
        idPosyandu: {equalTo: $idPosyandu}
      }
    ) {
      nodes {
        bb
        id
        jk
        nama
        tb
        usia
        posyandu: posyanduByIdPosyandu {
          nama
          id
        }
      }
    }
  }
`

export async function getOptionsPosyandu () {
  let items = await getPosyandu('');
  items = items.map(it => {
    return {
      value: it.id,
      text: it.nama
    }
  });
  items = [
    { value: null, text: 'semua' },
    ...items
  ];
  return items;
}

export async function get ({ keyword, idPosyandu }) {
  const result = await apolloClient.query({
    query: ListBalita,
    fetchPolicy: 'network-only',
    variables: {
      keyword: `%${keyword}%`,
      idPosyandu
    }
  })
  const items = result.data.allBalitas.nodes;
  return items;
}