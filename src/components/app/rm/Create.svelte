<script>
  import { onMount } from "svelte";
  import http from 'enjel/services/axios.js';
  import { push } from 'svelte-spa-router';
  import { object, string, number, array } from 'yup';

  let nama_pasien = "";
  let tanggal = "";
  let waktu = "";
  let id_penyakit = null;
  let gejala = [];
  let solusi = "";
  let status = "kasus";
  let errorMessage = null;
  let optionsPenyakit = [];
  let optionsGejala = [];

  const schema = object().shape({
    nama_pasien: string().required('nama pasien harus diisi').min(1, 'nama pasien harus lebih dari satu karakter'),
    waktu: string().required("waktu harus diisi"),
    id_penyakit: number().required("pilih penyakit").min(1, "penyakit invalid"),
    gejala: array().of(number().min(1, "gejala invalid")),
    solusi: string().required("solusi harus diisi"),
    status: string().required("status harus  diisi")
  });

  async function load_penyakit () {
    try {
      const response = await http.get("/v1/api/penyakit");
      optionsPenyakit = response.data.map(it => {
        return {
          value: it.id,
          text: it.nama
        }
      });
      optionsPenyakit = [
        ...optionsPenyakit,
        {
          value: null,
          text: "silahkan pilih penyakit"
        }
      ];
    } catch (err) {
      console.log(err);
      alert("gagal memuat data penyakit");
    }
  }

  async function load_gejala () {
    try {
      const response = await http.get('/v1/api/gejala');
      optionsGejala = response.data.map(it => ({
        value: it.id,
        text: it.nama,
        selected: false
      }));
    } catch (err) {
      console.log(err);
      alert("gagal mengambil data gejala");
    }
  }

  async function save () {
    const payload = {
      nama_pasien,
      waktu: `${tanggal}T${waktu}:00Z`,
      id_penyakit,
      gejala,
      solusi,
      status
    };
    console.log(payload);
    try {
      await schema.validate(payload);
      errorMessage = null;
    } catch (err) {
      errorMessage = err.message;
      console.log(err);
      return;
    }

    const url = "/v1/api/rm";
    try {
      const response = await http.post(url, payload);
      console.log(response.data);
      alert("sukses menambah data rekam medik");
      push("/app/rm");
    } catch (err) {
      console.log(err);
      alert("gagal menambah data rekam medik");
    }
  }

  onMount(async () => {
    try {
      await load_penyakit();
      await load_gejala();
    } catch (err) {
      console.log(err);
    }
  })
</script>

<div class="font-black text-center text-3xl mb-10">Tambah Data Kasus</div>
<div class="w-1/2 mx-auto rounded bg-gray-100 p-4">
  {#if errorMessage}
    <h3 class="text-center mb-3 text-red-600 font-black text-xl">{errorMessage}</h3>
  {/if}

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Nama Pasien
    </label>
    <input 
      bind:value={nama_pasien}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Tanggal Konsultasi
    </label>
    <input 
      bind:value={tanggal}
      type="date"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Waktu Konsultasi
    </label>
    <input 
      bind:value={waktu}
      type="time"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Penyakit
    </label>
    <select
      bind:value={id_penyakit}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      {#each optionsPenyakit as option}
        <option value={option.value}>{option.text}</option>
      {/each}
    </select>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Gejala
    </label>
    <div>
      {#each optionsGejala as option (option.value)}
        <div class="flex items-center mb-2">
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

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Solusi
    </label>
    <textarea
      bind:value={solusi}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
      id="username"/>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
      Status
    </label>
    <select
      bind:value={status}
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="kasus">Basis Kasus</option>
      <option value="revisi">Revisi</option>
    </select>
  </div>

  <button 
    class="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" 
    type="button"
    on:click={save}
  >
    Simpan
  </button>

</div>