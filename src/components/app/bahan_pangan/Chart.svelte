<script>
	import { onMount } from 'svelte';
	import ApexCharts from 'apexcharts';
	import http from 'enjel/services/axios.js';

	let items = [];
	let type = 'bar';

	async function getSummary () {
		try {
			const url = '/api/bahan_pangan/summary.php';
			const response = await http.get(url);
			items = response.data;
		} catch (err) {
			console.log(err);
			alert('gagal mengambil data');
		}
	}

	function buildChart () {
		if (!items || items.length == 0) return;

		let options = {
      chart: {
      	height: 500
    	},
    	stroke: {
      	colors: ['#fff']
    	},
    	fill: {
      	opacity: 0.8
    	}
   	};

		if (type == 'polarArea') {
			const series = items.map(it => it.total);
			const labels = items.map(it => it.kategori);
			options.chart.type = 'polarArea';
			options.series = series;
			options.labels = labels;
		} else if (type == 'pie') {
			const series = items.map(it => it.total);
			const labels = items.map(it => it.kategori);
			options.chart.type = 'pie';
			options.series = series;
			options.labels = labels;
		} else if (type == 'bar') {
			const labels = items.map(it => it.kategori);
			options.chart.type = 'bar';
			options.series = [
				{
					name: 'Jumlah Bahan Pangan',
					data: items.map(it => it.total)
				}
			];
			options.dataLabels = {
        enabled: false
      };
			options.xaxis = {
				categories: labels
			};
		}

		setTimeout(() => {
	    var chart = new ApexCharts(document.querySelector("#bp-chart-" + type), options);
	    chart.render();
		}, 1000);
	}

	onMount(async () => {
		await getSummary();
		buildChart(type);
	})
</script>

<div class="bg-gray-100 rounded flex items-center mb-4 p-4">
	<div class="text-xl font-semibold text-center">
		Perbandingan Jumlah Bahan Pangan
	</div>
	<div class="flex-grow"></div>
	<button 
		on:click={() => {
			type = 'pie'
			buildChart()
		}}
		class="appearance-none border border-gray-400 bg-white p-2 font-semibold text-gray-800 mr-2 rounded">
		Pie Chart
	</button>
	<button 
		on:click={() => {
			type = 'bar';
			buildChart()
		}}
		class="appearance-none border border-gray-400 bg-white p-2 font-semibold text-gray-800 mr-2 rounded">
		Bar Chart
	</button>
	<button 
		on:click={() => {
			type = 'polarArea'
			buildChart()
		}}
		class="appearance-none border border-gray-400 bg-white p-2 font-semibold text-gray-800 mr-2 rounded">
		Polar Chart
	</button>
</div>
<div id="bp-chart-wrapper" class="my-6">
	{#if type == 'polarArea'}
		<div id="bp-chart-polarArea">
		</div>
	{:else if type == 'bar'}
		<div id="bp-chart-bar">
		</div>
	{:else if type == 'pie'}
		<div id="bp-chart-pie">
		</div>
	{/if}
	
</div>