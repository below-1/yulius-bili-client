<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import GoPencil from 'svelte-icons/go/GoPencil.svelte'
  import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
  import GoTrashcan from 'svelte-icons/go/GoTrashcan.svelte'
  import FaChartBar from 'svelte-icons/fa/FaChartBar.svelte'
  import MdMoreHoriz from 'svelte-icons/md/MdMoreHoriz.svelte'
  import http from 'enjel/services/axios.js';
  import Dialog from 'enjel/components/commons/Dialog.svelte';
  import 'enjel/styles/jo-table.css';

  let keyword = '';
  let items = [];
  let id_posyandu = null;
  let optionsPosyandu = [];
  let take = 10;
  let page = 0;
  let totalPage = 0;
  let totalData = 0;
  let errorMessage = null;
  let networkStatus = 'loading';
  let showBalitaDialog = false;
  let idBalitaDialog = null;
  let antropometri = [];
  let nSolution = 1;
  let nSolutionUji = 1;
  const ALL_KATEGORI_OPTS = ['karbohidrat', 'protein', 'lemak'];
  let kategoris = [];

  $: pages = [...Array(totalPage).keys()].map(i => {
    return {
      text: i + 1,
      value: i
    }
  });
  $: getItems({ keyword, id_posyandu, page, take, antropometri });

  function showBalitaMenus (id) {
    showBalitaDialog = true;
    idBalitaDialog = id;
  }

  async function getOptionsPosyandu () {
    try {
      const url = '/api/posyandu/list.php';
      const response = await http.get(url);
      const temp = response.data.map(posyandu => ({
        value: posyandu.id,
        text: posyandu.nama
      }));
      optionsPosyandu = [
        { value: null, text: 'semua' },
        ...temp
      ];
      networkStatus = 'success';
    } catch (err) {
      networkStatus = 'error';
      console.log(err);
      alert('gagal mengambil data posyandu');
    }
  }

  async function getItems ({ keyword, id_posyandu, page, take, antropometri }) {
    if (antropometri.length == 0) return;
    console.log("getItems");
    const url = '/api/balita/list.php';
    try {
      const params = {
        keyword,
        id_posyandu,
        page,
        take
      };
      const response = await http.get(url, { params });
      const { data } = response;
      let _items = data.items;
      items = _items.map(it => {
        const statGizi = calcStatusGizi(it);
        return {
          ...it,
          statGizi
        }
      })
      totalPage = data.total_page;
      totalData = data.total_data;
      console.log(items);
      networkStatus = 'done';
    } catch (err) {
      console.log(err);
      networkStatus = 'error';
      alert('gagal mengambil data balita');
    }
  }

  async function deleteBalita (id) {
    const url = `/api/balita/delete.php?id=${id}`;
    try {
      const response = await http.delete(url);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      alert('gagal menghapus data balita');
    } finally {
      getDataBalita({ keyword, id_posyandu, page, take });
    }
  }

  async function getAntropometri () {
    console.log("getAntropometri");
    try {
      const response = await http.get('/api/antropometri/list.php');
      const { data } = response;
      antropometri = data;
    } catch (error) {
      console.log(error);
      alert("gagal mengambil data antropometri");
    }
  }

  function calcStatusGizi (balita) {
    let { tb: tinggi, usia, jk } = balita;
    let kelUmur = usia <= 24 ? '0_24' : '24_60';
    let ant_group = null;
    // console.log(antropometri);
    for (let i = 0; i < antropometri.length - 1; i++) {
      const ant_i = antropometri[i];
      const ant_j = antropometri[i + 1];
      if (tinggi >= ant_i.tinggi && tinggi < ant_j.tinggi) {
        ant_group = ant_i;
        break;
      }
    }
    if (!ant_group) throw new Error("UNKNOWN_ANTROPOMETRI");
    const { bb } = balita;
    const nom = bb - ant_group.med;
    const { med, min_1sd, plus_1sd } = ant_group;
    const denom = nom < 0 ? med - min_1sd : plus_1sd - med;
    const si = nom / denom;
    let status = null;
    if (si < -3) {
      status = 'gizi buruk';
    } else if (si >= -3 && si < -2) {
      status = 'gizi kurang';
    } else if (si >= -2 && si < 1) {
      status = 'gizi baik';
    } else if (si >= 1 && si < 2) {
      status = 'resiko gizi lebih';
    } else if (si >= 2 && si < 3) {
      status = 'gizi lebih';
    } else {
      status = 'gizi obesitas';
    }
    return status;
  }

  function onUji (idBalita) {
    localStorage.setItem("sigizi.uji.nSolution", nSolution);
    localStorage.setItem("sigizi.uji.kategoris", JSON.stringify(kategoris));
    push(`/app/balita/${idBalita}/uji`);
  }

  onMount(async () => {
    console.log("onMount");
    await getAntropometri();
    await getOptionsPosyandu();
  });
</script>

<!-- toolbar -->
<div class="rounded bg-gray-200 p-4 flex items-center sticky top-0">
  <div class="flex items-center mr-2 text-sm">
    <div class="bg-gray-100 p-1 pr-2 font-bold">
      Posyandu
    </div>
    <select 
      bind:value={id_posyandu}
      class="bg-white border border-gray-300 p-1 appearance-none mr-2"
    >
      {#each optionsPosyandu as opt (opt.value)}
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
      class="appearance-none p-1 rounded border-2 border-gray-300" 
      bind:value={keyword}
    />
  </div>

  <div class="flex-grow"></div>

  <a 
    href="/#/app/create-balita"
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

<table class="jo-table my-8">
  <thead>
    <th></th>
    <th>Nama</th>
    <th>Jenis Kelamin</th>
    <th>Usia</th>
    <th>Berat Badan</th>
    <th>Tinggi Badan</th>
    <th>Status Gizi</th>
    <th>Posyandu</th>
    <th></th>
  </thead>
  <tbody>
    {#each items as item (item.id)}
      <tr>
        <td>{item.id}</td>
        <td>{item.nama}</td>
        <td>{item.jk == 'l' ? 'Laki - Laki' : 'Perempuan'}</td>
        <td>{item.usia} bulan</td>
        <td>{item.bb} kg</td>
        <td>{item.tb} cm</td>
        <td>{item.statGizi}</td>
        <td>
          <a href={`/#/app/posyandu/${item.id_posyandu}`}>
            {item.nama_posyandu}
          </a>
        </td>
        <td class="flex items-center justify-end">
          <button 
            on:click={() => {
              showBalitaMenus(item.id);
            }}
            class="appearance-none h-8 w-8 p-2 text-indigo-700 bg-gray-200 rounded-full mr-2"
          >
            <MdMoreHoriz />
          </button>
          <a 
            href={`/#/app/balita/${item.id}`}
            class="h-8 w-8 text-blue-600 p-2 rounded-full mr-2 bg-gray-200"
          >
            <GoPencil />
          </a>
          <button 
            class="appearance-none h-8 w-8 p-2 text-red-600 bg-gray-200 rounded-full"
            on:click={() => {
              deleteBalita(item.id)
            }}
          >
            <GoTrashcan />
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

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

<Dialog bind:show={showBalitaDialog}>
  <div
    slot="content"
    class="bg-white p-12 shadow-lg flex flex-col"
    style="width: 500px;"
  >
    <a
      href={`/#/app/keb-gizi/${idBalitaDialog}`}
      class="appearance-none font-bold text-gray-700 border border-gray-300 bg-gray-200 rounded mr-1 py-1 px-3 mb-8 text-center"
    >
      Hitung Kebutuhan Gizi
    </a>
    <div class="flex">
      <input 
        bind:value={nSolution} 
        type="number" 
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4">
      <a
        href={`/#/app/balita/${idBalitaDialog}/menu-generator/${nSolution}`}
        class="appearance-none font-bold text-gray-700 border border-gray-300 bg-gray-200 rounded mr-1 py-1 px-3 text-center whitespace-no-wrap"
      >
        Generate Menu
      </a>
    </div>
    <div class="mt-6 p-4">
      <h4 class="font-bold">Pengujian</h4>

      <div class="mb-4">
        <label>Kategori</label>
        <select 
          bind:value={kategoris}
          multiple
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
        >
          {#each ALL_KATEGORI_OPTS as k}
            <option value={k}>{k}</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label>Jumlah Solusi</label>
        <input 
          bind:value={nSolutionUji} 
          type="number" 
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4">
      </div>

      <button
        on:click={() => {
          onUji(idBalitaDialog);
        }}
        class="appearance-none font-bold text-gray-700 border border-gray-300 bg-gray-200 rounded mr-1 py-1 px-3 text-center whitespace-no-wrap"
      >
        Uji
      </button>
    </div>
  </div>
</Dialog>