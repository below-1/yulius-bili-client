<script>
  import { pop } from 'svelte-spa-router';
  import { object, string, number, mixed } from 'yup';
  import http from 'enjel/services/axios.js';

  const schema = object().shape({
    nama: string()
      .required('nama harus diisi')
      .min(1, 'nama harus lebih dari satu karakter'),
    kategori: string()
      .required('kategori harus diisi')
      .min(1, 'kategori harus lebih dari satu karakter'),
    berat_min: number()
      .required('berat minimum harus diisi')
      .moreThan(0, 'berat minimum harus lebih besar dari 0'),
    berat_max: number()
      .required('berat maximum harus diisi')
      .moreThan(0, 'berat maximum harus lebih besar dari 0'),
    keb_energi: number()
      .required('kebutuhan energi harus diisi')
      .moreThan(0, 'kebutuhan energi harus lebih besar dari 0'),
    keb_protein: number()
      .required('kebutuhan protein harus diisi')
      .moreThan(0, 'kebutuhan protein harus lebih besar dari 0'),
    keb_lemak: number()
      .required('kebutuhan lemak harus diisi')
      .moreThan(0, 'kebutuhan lemak harus lebih besar dari 0'),
    keb_karbohidrat: number()
      .required('kebutuhan karbohidrat harus diisi')
      .moreThan(0, 'kebutuhan karbohidrat harus lebih besar dari 0'),
    satuan_urt: string()
      .required('"satuan urt rumah tangga" harus diisi')
      .min(1, '"ukuran rumah tangga" harus lebih dari satu karakter'),
    nilai_urt: number()
      .required('"nilai urt rumah tangga" harus diisi')
      .moreThan(0, '"ukuran rumah tangga" harus lebih dari 0'),
  });

  let nama = '';
  let kategori = '';
  let berat_min = 0;
  let berat_max = 0;
  let keb_energi = 0;
  let keb_protein = 0;
  let keb_lemak = 0;
  let keb_karbohidrat = 0;
  let satuan_urt = '';
  let nilai_urt = 0;
  let errorMessage = null;

  async function save () {
    const payload = {
      nama,
      kategori: kategori.toLowerCase(),
      berat_min,
      berat_max,
      keb_energi,
      keb_lemak,
      keb_karbohidrat,
      keb_protein,
      satuan_urt,
      nilai_urt
    };

    try {
      await schema.validate(payload);
      errorMessage = null;
    } catch (err) {
      errorMessage = err.message;
      alert(errorMessage);
      console.log(err);
    }

    if (errorMessage) return;
    const url = '/api/bahan_pangan/create.php';
    try {
      const result = await http.post(url, payload);
      console.log(result);
      alert('sukses menambah data bahan pangan');
      pop();
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal menambah data bahan pangan';
    }
  }
</script>

<div class="font-black text-center text-3xl mb-10">Tambah Data Bahan Pangan</div>

<div class="w-2/5 mx-auto rounded bg-gray-100 p-4">

  {#if errorMessage}
    <h3 class="text-center mb-3 text-red-600 font-black text-xl">{errorMessage}</h3>
  {/if}

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Nama Bahan Pangan
    </label>
    <input 
      bind:value={nama}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
      Kategori
    </label>
    <input 
      bind:value={kategori}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
     Berat Minimum 
    </label>
    <div class="flex items-center">
      <input 
        bind:value={berat_min}
        type="number"
        min="0"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="ml-2 text-gray-600 font-bold">gr</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
     Berat Maximum
    </label>
    <div class="flex items-center">
      <input 
        bind:value={berat_max}
        type="number"
        min="0"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">gr</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
     Kebutuhan Energi
    </label>
    <div class="flex items-center">
      <input 
        bind:value={keb_energi}
        type="number"
        min="0"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">kalori</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
     Kebutuhan Protein
    </label>
    <div class="flex items-center">
      <input 
        bind:value={keb_protein}
        type="number"
        min="0"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">gr</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
     Kebutuhan Lemak
    </label>
    <div class="flex items-center">
      <input 
        bind:value={keb_lemak}
        type="number"
        min="0"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">gr</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2">
     Kebutuhan Karbohidrat
    </label>
    <div class="flex items-center">
      <input 
        bind:value={keb_karbohidrat}
        type="number"
        min="0"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      <span class="text-gray-600 font-bold ml-2">gr</span>
    </div>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Satuan Ukuran Rumah Tangga
    </label>
    <input 
      bind:value={satuan_urt}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Nilai Ukuran Rumah Tangga
    </label>
    <div class="flex items-center">
      <input 
        bind:value={nilai_urt}
        type="number"
        min=0
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        id="username">
      <span class="text-gray-600 font-bold ml-2">gr</span>
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