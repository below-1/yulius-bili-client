<script>
  import { onMount } from 'svelte';
  import { GiziBee,  } from '../../services/bee';
  import getBahanPangan from 'enjel/services/getBahanPangan.js';

  let bee = undefined;

  onMount(async () => {
    console.log('just see this dumb words');
    try {
      const items = await getBahanPangan({ keyword: '', kategori: null });
      console.log(items);
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
      bee = new GiziBee(options);
      // bee.initSolutions();
      // bee.test(23);
      const solution = bee.optimize(23);
      // console.log();
      // console.log('solution');
      // console.log(solution);
    } catch (err) { 
      console.log(err);
    }
  });
</script>

<h1>And Thou Shall Fuck Your Mama!</h1>
