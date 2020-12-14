<script>
  import { object, string } from 'yup';
  import { pop } from 'svelte-spa-router';
  import http from 'enjel/services/axios.js';

  const schema = object().shape({
    nama: string()
      .required('nama harus diisi')
      .min(1, 'nama harus lebih dari satu karakter')
  });

  export let params = {};
  $: id = params.id ? parseInt(params.id) : null;
  let nama = '';
  let errorMessage = null;

  $: getPosyandu({ id });

  async function getPosyandu({ id }) {
    if (!id) return;
    const url = `/v1/api/penyakit/${id}`;
    try {
      const response = await http.get(url);
      nama = response.data.nama;
      errorMessage = null;
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal memuat data posyandu';
      alert(errorMessage);
    }
  }

  async function save () {
    if (!id) return;
    const payload = { nama };
    try {
      await schema.validate(payload);
      errorMessage = null;
    } catch (err) {
      errorMessage = err.message;
      console.log(err);
      return;
    }

    try {
      const url = `/v1/api/penyakit/${id}`;
      const response = await http.put(url, payload);
      console.log(response.data);
      alert('sukses mengubah data penyakit');
      pop();
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal mengubah data penyakit';
      return;
    }
  }
</script>

<div class="font-black text-center text-3xl mb-10">Edit Data Penyakit</div>
<div class="w-1/2 mx-auto rounded bg-gray-100 p-4">
  {#if errorMessage}
    <h3 class="text-center mb-3 text-red-600 font-black text-xl">{errorMessage}</h3>
  {/if}

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Nama Penyakit
    </label>
    <input 
      bind:value={nama}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username">
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={save}
  >
    Simpan
  </button>

</div>