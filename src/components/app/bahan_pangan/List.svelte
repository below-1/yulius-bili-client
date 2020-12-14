<script>
  import { onMount } from 'svelte';
  import GoPencil from 'svelte-icons/go/GoPencil.svelte'
  import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
  import GoTrashcan from 'svelte-icons/go/GoTrashcan.svelte'
  import FaChartBar from 'svelte-icons/fa/FaChartBar.svelte'
  import http from 'enjel/services/axios.js';
  import 'enjel/styles/jo-table.css';

  let items = [];
  let keyword = '';
  let kategori = null;
  let optionsKategori = [];
  let errorMessage = null;
  let take = 10;
  let page = 0;
  let totalPage = 0;
  let networkStatus = 'loading';

  $: getItems({ keyword, kategori, take, page });
  $: pages = [...Array(totalPage).keys()].map(i => {
    console.log(i);
    return {
      text: i + 1,
      value: i
    }
  });

  async function getOptionsKategori () {
    try {
      const url = '/api/bahan_pangan/kategori.php';
      const response = await http.get(url);
      console.log(response.data)
      let itemsKategori = response.data.map(it => {
        return {
          value: it.kategori,
          text: it.kategori
        }
      })
      itemsKategori = [
        { value: null, text: 'semua' },
        ...itemsKategori
      ]
      optionsKategori = itemsKategori
    } catch (err) {
      errorMessage = 'gagal memuat data kategori';
      console.log(err);
    }
  }

  async function getItems ({ keyword, kategori, page, take }) {
    networkStatus = 'loading';
    try {
      const url = '/api/bahan_pangan/list.php';
      const params = {
        keyword,
        kategori,
        page,
        take
      };
      const response = await http.get(url, { params });
      items = response.data.items;
      totalPage = response.data.total_page;
      networkStatus = 'done';
      console.log(response.data);
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal memuat data bahan pangan';
      networkStatus = 'error';
    }
  }

  async function deleteItem (id) {
    const url = `/api/bahan_pangan/delete.php?id=${id}`;
    try {
      const response = await http.delete(url);
      console.log(response.data);
    } catch (err) {
      alert('gagal menghapus data');
      console.log(err);
    } finally {
      await getItems({ keyword, kategori });
    }
  }

  onMount(getOptionsKategori);
</script>

<div class="rounded bg-gray-200 p-4 flex items-center">
  <div class="flex items-center mr-2 text-sm">
    <div class="bg-gray-100 p-1 pr-2 font-bold">
      Kategori
    </div>
    <select 
      bind:value={kategori}
      class="bg-white border border-gray-300 p-1 appearance-none mr-2"
    >
      {#each optionsKategori as opt (opt.value)}
        <option value={opt.value}>{opt.text}</option>
      {/each}
    </select>
  </div>
  <div class="flex items-center mr-2 text-sm">
    <div class="bg-gray-100 p-1 pr-2 font-bold">
      Jumlah Per Halaman
    </div>
    <select 
      bind:value={take}
      class="bg-white border border-gray-300 p-1 appearance-none mr-2"
    >
      <option>5</option>
      <option>10</option>
      <option>25</option>
      <option>50</option>
    </select>
  </div>
  <div class="flex items-center mr-2 text-sm">
    <div class="bg-gray-100 p-1 pr-2 font-bold">
      Pencarian
    </div>
    <input 
      bind:value={keyword}
      class="appearance-none p-1 rounded border-2 border-gray-300 text-sm" 
    />
  </div>
  <div class="flex-grow"></div>
  <a 
    href="/#/app/create-bahan-pangan"
    class="bg-gray-100 border border-gray-400 rounded flex items-center px-4 py-1 mr-2"
  >
    <div class="font-bold mr-2">tambah</div>
    <div class="h-5 w-5 text-blue-600">
      <FaPlus />
    </div>
  </a>
  <a 
    href="/#/app/chart-bahan-pangan"
    class="bg-gray-100 border border-gray-400 rounded flex items-center px-4 py-1"
  >
    <div class="font-bold mr-2">chart</div>
    <div class="h-5 w-5 text-orange-600">
      <FaChartBar/>
    </div>
  </a>
</div>

{#if networkStatus == 'done'}
  <table 
    class="jo-table my-8">
    <thead>
      <th></th>
      <th>Nama</th>
      <th>Kategori</th>
      <th>Satuan URT</th>
      <th>Nilai URT/100gr</th>
      <th>Berat Min</th>
      <th>Berat Max</th>
      <th>K. Energi</th>
      <th>K. Protein</th>
      <th>K. Lemak</th>
      <th>K. Karbohidrat</th>
      <th></th>
    </thead>
    <tbody>
      {#each items as item (item.id)}
        <tr>
          <td>{item.id}</td>
          <td>{item.nama}</td>
          <td>{item.kategori}</td>
          <td>{item.satuan_urt}</td>
          <td>{item.nilai_urt}</td>
          <td>{item.berat_min} gr</td>
          <td>{item.berat_max} gr</td>
          <td>{item.keb_energi} kalori</td>
          <td>{item.keb_protein} gr</td>
          <td>{item.keb_lemak} gr</td>
          <td>{item.keb_karbohidrat} gr</td>
          <td class="flex items-center justify-end">
            <a 
              href={`/#/app/bahan-pangan/${item.id}`}
              class="h-8 w-8 text-blue-600 p-2 rounded-full mr-2 bg-gray-200"
            >
              <GoPencil />
            </a>
            <button 
              class="appearance-none h-8 w-8 p-2 text-red-600 bg-gray-200 rounded-full"
              on:click={() => {
                deleteItem(item.id)
              }}
            >
              <GoTrashcan />
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else if networkStatus == 'loading'}
  Loading...
{/if}

<ul 
  class="my-4 flex justify-center items-center"
>
  {#each pages as p}
    <button
      class="appearance-none text-xs font-bold text-gray-700 border border-gray-300 bg-gray-200 rounded mr-1 py-1 px-3"
      class:bg-gray-500={page == p.value}
      on:click={() => {
        page = p.value;
      }}
    >
      {p.text}
    </button>
  {/each}
</ul>