<script>
  import { object, string, number } from 'yup';
  import { pop } from 'svelte-spa-router';
  import http from 'enjel/services/axios.js';

  const schema = object().shape({
    nama: string().required('nama harus diisi').min(1, 'nama harus lebih dari satu karakter'),
    bobot: number().required("bobot harus diisi").max(1, "bobot tidak boleh lebih dari 1")
  });

  export let params = {};
  $: id = params.id ? parseInt(params.id) : null;
  let nama = '';
  let bobot = 1;
  let errorMessage = null;

  $: getItem({ id });

  async function getItem({ id }) {
    if (!id) return;
    const url = `/v1/api/gejala/${id}`;
    try {
      const response = await http.get(url);
      nama = response.data.nama;
      bobot = response.data.bobot;
      errorMessage = null;
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal memuat data gejala';
      alert(errorMessage);
    }
  }

  async function save () {
    if (!id) return;
    const payload = { nama, bobot };
    try {
      await schema.validate(payload);
      errorMessage = null;
    } catch (err) {
      errorMessage = err.message;
      console.log(err);
      return;
    }

    try {
      const url = `/v1/api/gejala/${id}`;
      const response = await http.put(url, payload);
      console.log(response.data);
      alert('sukses mengubah data gejala');
      pop();
    } catch (err) {
      console.log(err);
      errorMessage = 'gagal mengubah data gejala';
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
      Nama Gejala
    </label>
    <input 
      bind:value={nama}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="bobot_gejala">
      Bobot Gejala
    </label>
    <input 
      bind:value={bobot}
      type="number"
      min=0
      max=1
      step=0.01
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      id="bobot_gejala"
    >
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={save}
  >
    Simpan
  </button>
</div>