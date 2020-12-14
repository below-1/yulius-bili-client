<script>
  import http from 'enjel/services/axios.js';
  import { 
    fBBI,
    kebutuhanProtein,
    kebutuhanLemak,
    kebutuhanKarbohidrat
  } from "enjel/services/gizi.js";
  import 'enjel/styles/jo-table.css';

	export let params = {};

	let item = {};
	$: idBalita = params.id ? parseInt(params.id) : null;
	$: getDataBalita(idBalita);
  $: namaBalita = item.nama ? item.nama : '---';

  $: data = calculateData(item);

  function calculateData (item) {
    if (!item) return null;
    const bbi = item ? fBBI(item.usia) : null;
    const targetKalor = 100 * bbi;
    const kebProtein = 0.1 * targetKalor / 4.0;
    const kebLemak = 0.2 * targetKalor / 9.0;
    const kebKarbohidrat = 0.7 * targetKalor / 4.0;
    const perHari = {
      targetKalor,
      kebProtein,
      kebLemak,
      kebKarbohidrat
    }
    const perMakan = {
      targetKalor: targetKalor / 3.0,
      kebProtein: kebProtein / 3.0,
      kebLemak: kebLemak / 3.0,
      kebKarbohidrat: kebKarbohidrat / 3.0
    }
    return {
      bbi,
      perHari,
      perMakan
    }
  }

	async function getDataBalita (id) {
		if (!id) return;
    const url = `/api/balita/single.php?id=${id}`;
    try {
      const response = await http.get(url);
      const it = response.data;
      item = it;
    } catch (err) {
      console.log(err);
      alert('gagal mengambil data balita');
      pop();
      return;
    }
	}
</script>

<div class="rounded bg-gray-200 p-4 flex items-center sticky top-0">
	<div class="bg-gray-100 p-1 pr-2 font-bold">
    Kebutuhan Gizi {namaBalita}
  </div>
</div>

{#if data}
  <div class="font-bold text-sm text-center mt-8 mb-2">Kebutuhan Per Hari</div>
  <div class="mx-auto w-3/5">
    <table class="jo-table">
      <thead>
        <th>Berat Badan Ideal {item.nama}</th>
        <th>Kalori</th>
        <th>Protein</th>
        <th>Lemak</th>
        <th>Karbohidrat</th>
      </thead>
      <tbody>
        <tr>
          <td>{data.bbi.toFixed(2)}</td>
          <td>{data.perHari.targetKalor.toFixed(2)}</td>
          <td>{data.perHari.kebProtein.toFixed(2)}</td>
          <td>{data.perHari.kebLemak.toFixed(2)}</td>
          <td>{data.perHari.kebKarbohidrat.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="font-bold text-sm text-center mt-8 mb-2">Kebutuhan Sekali Makan</div>
  <div class="mx-auto w-3/5">
    <table class="jo-table">
      <thead>
        <th>Berat Badan Ideal {item.nama}</th>
        <th>Kalori</th>
        <th>Protein</th>
        <th>Lemak</th>
        <th>Karbohidrat</th>
      </thead>
      <tbody>
        <tr>
          <td>{data.bbi.toFixed(2)}</td>
          <td>{data.perMakan.targetKalor.toFixed(2)}</td>
          <td>{data.perMakan.kebProtein.toFixed(2)}</td>
          <td>{data.perMakan.kebLemak.toFixed(2)}</td>
          <td>{data.perMakan.kebKarbohidrat.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  </div>
{/if}