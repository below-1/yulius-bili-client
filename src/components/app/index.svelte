<script>
  import { pop } from "svelte-spa-router";
  import { onMount, tick } from "svelte";
  import Router from 'svelte-spa-router';
  import AppBar from 'enjel/components/commons/AppBar.svelte';
  import Navbar from 'enjel/components/commons/Navbar.svelte';
  import AppFooter from 'enjel/components/commons/AppFooter.svelte';
  import CreateBalita from './balita/Create.svelte';
  import ListBalita from './balita/List.svelte';
  import EditBalita from './balita/Edit.svelte';
  import KebGizi from './balita/KebGizi.svelte';
  import MenuGenerator from "./balita/MenuGenerator.svelte";
  import UjiGenerator from "./balita/UjiGenerator.svelte";
  import CreatePosyandu from './posyandu/Create.svelte';
  import EditPosyandu from './posyandu/Edit.svelte';
  import ListPosyandu from './posyandu/List.svelte';
  import CreateBahanPangan from './bahan_pangan/Create.svelte';
  import ListBahanPangan from './bahan_pangan/List.svelte';
  import EditBahanPangan from './bahan_pangan/Edit.svelte';
  import ChartBahanPangan from './bahan_pangan/Chart.svelte';
  import Optimization from './Optimization.svelte';

  import ListPenyakit from "./penyakit/List.svelte";
  import CreatePenyakit from "./penyakit/Create.svelte";
  import EditPenyakit from "./penyakit/Edit.svelte";
  import ListGejala from "./gejala/List.svelte";
  import CreateGejala from "./gejala/Create.svelte";
  import EditGejala from "./gejala/Edit.svelte";
  import CreateRekamMedik from "./rm/Create.svelte";
  import EditRekamMedik from "./rm/Edit.svelte";
  import ListRm from "./rm/List.svelte";
  import CbrInput from "./cbr/CbrInput.svelte";
  import TestKFold from "./test/index.svelte";

  const routes = {
    '/balita': ListBalita,
    '/balita/:id': EditBalita,
    '/balita/:id/menu-generator/:n': MenuGenerator,
    '/balita/:id/uji': UjiGenerator,
    '/keb-gizi/:id': KebGizi,
    '/create-balita': CreateBalita,
    '/create-posyandu': CreatePosyandu,
    '/posyandu': ListPosyandu,
    '/posyandu/:id': EditPosyandu,
    '/create-bahan-pangan': CreateBahanPangan,
    '/chart-bahan-pangan': ChartBahanPangan,
    '/bahan-pangan': ListBahanPangan,
    '/bahan-pangan/:id': EditBahanPangan,
    '/opt': Optimization,

    "/penyakit": ListPenyakit,
    "/create-penyakit": CreatePenyakit,
    "/penyakit/:id": EditPenyakit,
    "/gejala": ListGejala,
    "/create-gejala": CreateGejala,
    "/gejala/:id": EditGejala,
    "/create-rm": CreateRekamMedik,
    "/rm": ListRm,
    "/rm/:id": EditRekamMedik,
    "/cbr": CbrInput,
    "/kfold": TestKFold
  };
  const prefix = '/app';

  let loading = true;

  onMount(async () => {
    const username = localStorage.getItem("sigizi.username");
    if (!username) {
      pop();
    }
    await tick();
    loading = false;
  })
</script>

{#if loading}
  <div>loading...</div>
{:else}
  <AppBar></AppBar>
  <Navbar></Navbar>
  <div class="flex flex-col" style="min-height: calc(100vh - 5rem);">
    <div class="my-6 px-4 flex-grow">
      <Router {routes} {prefix}></Router>
    </div>
    <AppFooter/>
  </div>
{/if}
