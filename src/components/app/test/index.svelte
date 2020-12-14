<script>
  import { onMount } from "svelte";
  import http from 'enjel/services/axios.js';
  import { push } from 'svelte-spa-router';
  import { format } from "date-fns";
  import { kfold } from "enjel/services/cbr.js";
  import 'enjel/styles/jo-table.css';

  let errorMessage = null;
  let gejalases = [];
  let kasuses = [];
  let penyakits = [];

  let k = 2;
  let results = [];

  $: main_accuracy = results.length ? results.map(r => r.accuracy).reduce((a, b) => a + b, 0) : 0;

  async function run_kfold () {
    results = kfold({
      kasuses,
      gejalases,
      penyakits,
      k
    });
    console.log(results);
  }

  async function load_gejala () {
    try {
      const response = await http.get('/v1/api/gejala');
      gejalases = response.data;
    } catch (err) {
      console.log(err);
      alert("gagal mengambil data gejala");
    }
  }

  async function load_all_penyakit () {
    try {
      const response = await http.get("/v1/api/penyakit");
      penyakits = response.data;
    } catch (err) {
      console.log(err);
      alert("gagal mengambil data penyakit");
    }
  }

  async function load_all_kasus () {
    try {
      const response = await http.get('/v1/api/rm', {
        params: { status: "kasus" }
      });
      kasuses = response.data;
    } catch (err) {
      console.log(err);
      alert("gagal mengambil data gejala");
    }
  }

  onMount(async () => {
    try {
      await load_gejala();
      await load_all_kasus();
      await load_all_penyakit();
      console.log("ready now!");
    } catch (err) {
      console.log(err);
    }
  })
</script>

{#if results.length == 0}
<div class="font-black text-center text-3xl mb-10">Form KFold</div>
<div class="w-1/2 mx-auto rounded bg-gray-100 p-4">
  {#if errorMessage}
    <h3 class="text-center mb-3 text-red-600 font-black text-xl">{errorMessage}</h3>
  {/if}

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Parameter KFold
    </label>
    <input 
      bind:value={k}
      type="number"
      min=2
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={run_kfold}
  >
    Jalankan
  </button>
</div>
{:else}
<div class="font-bold text-xl mb-10">Rata Rata Akurasi: {(main_accuracy * 100).toFixed(3)} %</div>
<table class="jo-table my-8">
  <thead>
    <th></th>
    <th>Jumlah Data</th>
    <th>Jumlah Benar</th>
    <th>Rata Rata Akurasi</th>
  </thead>
  <tbody>
    {#each results as part, index (index)}
      <tr class="text-base">
        <td>{index + 1}</td>
        <td>{part.total}</td>
        <td>{part.hits}</td>
        <td>{(part.accuracy * 100).toFixed(3)} %</td>
      </tr>
    {/each}
  </tbody>
</table>
{/if}
