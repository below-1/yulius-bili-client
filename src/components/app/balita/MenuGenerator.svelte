<script>
  import { onMount } from 'svelte';
  import http from 'enjel/services/axios.js';
  import { GiziBee,  } from '../../../services/bee';
  import getBahanPangan from 'enjel/services/getBahanPangan.js';
  import { range } from "lodash";

  export let params = {}; 

  let balita = {};
  let nSolutions = 0;
  let bee = null;
  let solution = null;
  let solutions = [];
  let listDetails = [];

  $: namaBalita = balita ? balita.nama : '---';
  $: fetchSolutionDetail(solutions);

  async function getDataBalita (id) {
		if (!id) return;
    const url = `/api/balita/single.php?id=${id}`;
    try {
      const response = await http.get(url);
      const it = response.data;
      balita = it;
    } catch (err) {
      console.log(err);
      alert('gagal mengambil data balita');
      pop();
      return;
    }
  }

  async function fetchSolutionDetail (solutions) {
    try {
      const _proms = solutions.map(solution => getSolutionDetail(solution));
      listDetails = await Promise.all(_proms);
      console.log("listDetails");
      console.log(listDetails);
    } catch (err) {
      console.log(err);
      alert("gagal mengambil detail dari database");
    }
  }

  async function getSolutionDetail (solution) {
    if (!solution) return;
    console.log(solution);
    try {
      const _proms = solution.items.map(async id => {
        const response = await http.get(`/api/bahan_pangan/single.php?id=${id}`);
        const { data } = response;
        return data;
      });
      const _details = await Promise.all(_proms);
      return _details;
      // console.log(details);
    } catch (error) {
      console.log(error);
    }
  }

  async function generate ({ items, usia }) {
    try {
      const options = {
        data: items,
        food: 50,
        dimension: 3,
        maxIter: 500,
        upperBounds: [300, 300, 300],
        lowerBounds: [100, 40, 100],
        onlookers: 25,
        limit: 25
      };
      const _bee = new GiziBee(options);
      // bee.initSolutions();
      // bee.test(23);
      const _solution = _bee.optimize(usia);
      return _solution;
    } catch (err) {
      console.log(err);
      alert('gagal mengambil data bahan pangan');
    }
  }
  
  async function runGenerator (usia) {
    try {
      const _items = await getBahanPangan({ keyword: '', kategori: null });
      const _proms = range(nSolutions).map(i => generate({ items: _items, usia }));
      solutions = await Promise.all(_proms);
      console.log("solutions");
      console.log(solutions);
    } catch (err) {
      console.log(err);
      alert('gagal mengambil data bahan pangan');
    }
  }

  onMount(async () => {
    if (!params.id) return;
    if (!params.n) return;
    nSolutions = parseInt(params.n);
    const idBalita = parseInt(params.id);
    await getDataBalita(idBalita);
    await runGenerator(balita.usia)
  });
</script>

{#if listDetails && listDetails.length > 0}
  <div class="font-bold text-xl text-center mt-8 mb-8">Kebutuhan Sekali Makan</div>
  {#each listDetails as details, i (i)}
    {#if details}
      <div class="mx-auto w-3/5 mb-4">
        <table class="jo-table">
          <thead>
            <tr>
              {#each details as detail (detail.id)}
                <td class="p-4">{detail.nama}</td>
              {/each}
            </tr>
          </thead>
          <tbody>
            <tr>
              {#each details as detail, index (detail.id)}
                <td class="px-4">
                  {solutions[i].weights[index].toFixed(2)} gr
                  --- 
                  {Math.round((solutions[i].weights[index] / details[index].berat_min) * 4)} {details[index].satuan_urt}
                </td>
              {/each}
            </tr>
          </tbody>
        </table>
      </div>
    {/if}
  {/each}
{/if}