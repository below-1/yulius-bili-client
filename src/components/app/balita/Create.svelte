<script>
  import { onMount } from 'svelte';
  import { pop } from 'svelte-spa-router';
  import { object, string, number, mixed } from 'yup';
  import http from 'enjel/services/axios.js';

  let schema = object().shape({
    nama: string().required('nama harus diisi').min(1, 'nama harus lebih dari satu karakter'),
    usia: number().required('usia harus diisi').min(0, 'usia harus lebih besar dari 0'),
    jk: mixed().oneOf(['L', 'P']).required('jenis kelamin harus diisi'),
    bb: number().required('berat badan harus diisi').moreThan(0, 'berat badan harus lebih besar dari 0'),
    tb: number().required('tinggi badan harus diisi').moreThan(0, 'tinggi badan harus lebih besar dari 0')
  });

  let nama = '';
  let usia = 0;
  let jk = 'L';
  let bb = 0;
  let tb = 0;
  let idPosyandu = 0;
  let optionsPosyandu = [];
  let errorMessage = null;

  async function save () {
    const payload = {
      nama,
      usia,
      jk,
      bb,
      tb,
      id_posyandu: idPosyandu
    };

    try {
      await schema.validate(payload);
      errorMessage = null;
    } catch (err) {
      errorMessage = err.message;
      console.log(err);
    }

    const url = '/api/balita/create.php';
    try {
      const response = await http.post(url, payload);
      console.log(response.data);
      alert('sukses menambah data balita');
      pop();
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal menambah data balita';
    }
  }

  onMount(async () => {
    const url = '/api/posyandu/list.php';
    try {
      const response = await http.get(url);
      optionsPosyandu = response.data.map(posyandu => ({
        value: posyandu.id,
        text: posyandu.nama
      }));
      if (optionsPosyandu.length) {
        idPosyandu = optionsPosyandu[0].value;
      }
    } catch (err) {
      errorMessage = 'gagal mengambil data posyandu';
    }
  });
</script>

<div class="font-black text-center text-3xl mb-10">Tambah Data Balita</div>

<div class="w-1/2 mx-auto rounded bg-gray-100 p-4">

  {#if errorMessage}
    <h3 class="text-center mb-3 text-red-600 font-black text-xl">{errorMessage}</h3>
  {/if}

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Nama Balita
    </label>
    <input 
      bind:value={nama}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      Posyandu
    </label>
    <div class="inline-block relative w-64">
      <select 
        bind:value={idPosyandu}
        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
        {#each optionsPosyandu as opt (opt.value)}
          <option value={opt.value}>{opt.text}</option>
        {/each}
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Usia (dalam bulan)
    </label>
    <div class="flex items-center">
      <input bind:value={usia} type="number" min="0" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2"></span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      Jenis Kelamin
    </label>
    <div class="inline-block relative w-64">
      <select 
        bind:value={jk}
        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
        <option value="L">Laki - Laki</option>
        <option value="P">Perempuan</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Berat Badan
    </label>
    <div class="flex items-center">
      <input bind:value={bb} 
        type="number" 
        min="0" 
        step="0.01"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">kg</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Tinggi Badan
    </label>
    <div class="flex items-center">
      <input bind:value={tb} 
        type="number" 
        min="0" 
        step="0.01"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">cm</span>
    </div>
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={save}
  >
    Simpan
  </button>

</div>