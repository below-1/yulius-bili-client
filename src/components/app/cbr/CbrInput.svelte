<script>
  import { onMount } from "svelte";
  import http from 'enjel/services/axios.js';
  import { push } from 'svelte-spa-router';
  import { format } from "date-fns";
  import { retrieve } from "enjel/services/cbr.js";

  let gejala = [15, 16, 25, 26];
  let optionsGejala = [];
  let errorMessage = null;

  let gejalases = [];
  let kasuses = [];
  let penyakits = [];

  let result_penyakit = null;
  let result_rm_max_sim = null;
  $: result_solusi = result_rm_max_sim ? result_rm_max_sim.solusi : null;

  async function run_cbr () {
    const newKasus = gejala;
    result_rm_max_sim = await retrieve({
      kasuses,
      newKasus,
      gejalases,
      penyakits
    });
    result_penyakit = result_rm_max_sim.penyakit;
  }

  async function load_gejala () {
    try {
      const response = await http.get('/v1/api/gejala');
      gejalases = response.data;
      optionsGejala = response.data.map(it => {
        return {
          value: it.id,
          text: it.nama,
          selected: false
        }
      });
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

{#if result_penyakit == null}
<div class="font-black text-center text-3xl mb-10">Pilih Gejala</div>
<div class="w-1/2 mx-auto rounded bg-gray-100 p-4">
  {#if errorMessage}
    <h3 class="text-center mb-3 text-red-600 font-black text-xl">{errorMessage}</h3>
  {/if}

  <div class="mb-4">
    <div>
      {#each optionsGejala as option (option.value)}
        <div class="flex items-center py-2 border-b border-gray-300">
          <input 
            type="checkbox" 
            class="mr-6 rounded-full border border-gray-300"
            bind:group={gejala}
            value={option.value}
          />
          <label>{option.text}</label>
        </div>
      {/each}
    </div>
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={run_cbr}
  >
    Jalankan
  </button>
</div>
{:else}

<div class="font-black text-center text-3xl mb-10">Hasil</div>
<div class="w-1/2 mx-auto rounded bg-gray-100 p-4">

  <div class="mb-4 text-center">
    <h2 class="text-lg font-medium">penyakit</h2>
    <h2 class="text-3xl font-black mb-8">{result_penyakit.nama}</h2>
    <h2 class="text-lg font-medium">solusi yang ditawarkan</h2>
    <h2 class="text-3xl font-black mb-8">{result_solusi}</h2>
    <h2 class="text-xl font-bold">tingkat kemiripan: {result_rm_max_sim.sim}</h2>
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={() => {
      result_penyakit = null;
    }}
  >
    Ulangi
  </button>
</div>
{/if}
