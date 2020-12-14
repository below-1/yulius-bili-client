<script>
  import { object, string } from 'yup';
  import { push } from 'svelte-spa-router';
  import http from 'enjel/services/axios.js';

  const schema = object().shape({
    nama: string().required('nama harus diisi').min(1, 'nama harus lebih dari satu karakter')
  });

  let nama = '';
  let errorMessage = null;

  async function save () {
    const payload = { nama };
    try {
      await schema.validate(payload);
      errorMessage = null;
    } catch (err) {
      errorMessage = err.message;
      console.log(err);
      return;
    }

    const url = '/v1/api/penyakit';
    try {
      const result = await http.post(url, payload);
      console.log(result.data);
      alert('sukses menambah data penyakit');
      push('/app/penyakit');
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal menambah data penyakit';
      return;
    }
  }
</script>

<div class="font-black text-center text-3xl mb-10">Tambah Data Penyakit</div>
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