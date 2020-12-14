<script>
  import { onMount } from 'svelte';
  import { format } from "date-fns";
  import { id as localeId } from 'date-fns/locale'
  import 'enjel/styles/jo-table.css';
  import http from 'enjel/services/axios.js';

  let keyword = '';
  let items = [];
  $: filtered = filterByKeyword({ keyword, items });
  let errorMessage = null;

  function filterByKeyword ({ keyword, items }) {
    if (keyword == '') return items;
    const upper = keyword.toUpperCase();
    return items.filter(item => {
      return item.nama_pasien.toUpperCase().includes(upper);
    })
  }

  async function deleteItem (id) {
    try {
      const url = `/v1/api/rm/${id}`;
      const response = await http.delete(url);
      console.log(response.data);
    } catch (err) {
      alert('gagal menghapus data');
      console.log(err);
    } finally {
      await loadData();
    }
  }

  async function loadData () {
    try {
      const response = await http.get('/v1/api/rm');
      items = response.data.map(item => {
        return {
          ...item,
          waktu: format(new Date(item.waktu), "HH:mm dd LLLL, yyyy", { locale: localeId  })
        }
      });
      console.log(items);
    } catch (err) {
      alert('gagal');
      console.log(err);
    }
  }

  onMount(loadData);
</script>

<!-- toolbar -->
<div class="rounded bg-gray-200 p-4 flex items-center">
  <h2 class="font-black text-xl">Daftar Kasus</h2>
  <div class="flex-grow"></div>
  <div class="flex items-center mr-2 text-sm">
    <div class="bg-gray-100 p-1 pr-2 font-bold">
      Pencarian
    </div>
    <input 
      bind:value={keyword}
      class="appearance-none p-1 rounded border-2 border-gray-300" 
    />
  </div>
  <a 
    href="/#/app/create-rm"
    class="p-2 py-1 bg-indigo-600 ml-2 text-white appearance-none"
  >Tambah</a>
</div>

<table class="jo-table my-8">
  <thead>
    <th></th>
    <th>Nama</th>
    <th>Waktu</th>
    <th>Penyakit</th>
    <th>Solusi</th>
    <th>Status</th>
    <th></th>
  </thead>
  <tbody>
    {#each filtered as item (item.id)}
      <tr class="text-base">
        <td>{item.id}</td>
        <td>{item.nama_pasien}</td>
        <td>{item.waktu}</td>
        <td>
          <a href={`/app/penyakit/${item.id_penyakit}`}>
            {item.penyakit_nama}
          </a>
        </td>
        <td>{item.solusi}</td>
        <td>{item.status}</td>
        <td class="flex items-center justify-end">
          <a 
            href={`/#/app/rm/${item.id}`}
            class="appearance-none px-2 py-1 text-sm font-bold bg-indigo-600 text-white mr-2 rounded"
          >edit
          </a>
          <button 
            class="appearance-none px-2 py-1 text-sm font-bold bg-red-600 text-white rounded"
            on:click={() => {
              deleteItem(item.id)
            }}
          >hapus</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>