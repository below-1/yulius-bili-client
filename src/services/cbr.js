import { maxBy, range, shuffle, sum } from "lodash";

const BIAS = 1;

export function naiveBayes ({ newKasus, gejalases, kasuses, penyakits }) {
  const N_PENYAKIT = penyakits.length;
  let gejala = new Map();
  gejalases.forEach(g => {
    gejala.set(g.id, g.bobot);
  });
  let mapping_penyakit = new Map();
  let map_p_g = new Map();
  let p_prob = new Map();
  let attr_p_prob = new Map();

  for (let k of kasuses) {
    if (mapping_penyakit.has(k.penyakit_id)) {
      mapping_penyakit.set(k.penyakit_id, mapping_penyakit.get(k.penyakit_id) + 1);
    } else {
      mapping_penyakit.set(k.penyakit_id, 1);
    }
  }

  Array.from(mapping_penyakit.keys()).forEach(p => {
    const total = mapping_penyakit.get(p);
    const prob = (total + BIAS) / (newKasus.length + (N_PENYAKIT * BIAS));
    p_prob.set(p, prob);
  });

  penyakits.forEach(p => {
    let inner = new Map();
    let sub_kasuses = kasuses.filter(k => k.penyakit_id == p.id);
    let n_p = sub_kasuses.length;
    gejalases.forEach(g => {
      const contain_g = sub_kasuses.filter(k => k.gejala.includes(g.id));
      const n_g = contain_g.length;

      const nominator = n_g + BIAS;
      const denominator = mapping_penyakit.get(p.id) + (N_PENYAKIT * BIAS);
      const prob = nominator / denominator;

      inner.set(g.id, prob);
    });
    attr_p_prob.set(p.id, inner);
  });

  const probs = penyakits.map(p => 
    ({
      prob: newKasus
        .map(g => attr_p_prob.get(p.id).get(g))
        .reduce((a, b) => a * b, 1) * p_prob.get(p.id),
      p
    }));
  const maxPData = maxBy(probs, pdata => pdata.prob);
  return maxPData.p;
}

export function knn({ kasuses, newKasus, gejalases, penyakit_id }) {
  const subs = kasuses.filter(k => k.penyakit_id == penyakit_id);
  // console.log(subs);
  let g_b_map = new Map();
  for (let g of gejalases) {
    g_b_map.set(g.id, g.bobot);
  }

  const sims = subs.map(sk => {
    // compare with newKasus
    let sameGs = [];
    let all_gs = new Set();
    for (let g of sk.gejala) {
      all_gs.add(g);
    }
    for (let g of newKasus) {
      all_gs.add(g);
    }

    newKasus.forEach(g => {
      if (sk.gejala.includes(g)) {
        sameGs.push(g);
      }
    });

    const nominator = sameGs
      .map(g => g_b_map.get(g))
      .reduce((a, b) => a + b, 0);

    const denominator = Array.from(all_gs)
      .map(g => g_b_map.get(g))
      .reduce((a, b) => a + b, 0);

    return {
      ...sk,
      sim: nominator / denominator
    }
  });

  return maxBy(sims, it => it.sim);
}

export function retrieve ({ kasuses, gejalases, penyakits, newKasus }) {
  const result_penyakit = naiveBayes({ newKasus, kasuses, gejalases, penyakits });
  const penyakit_id = result_penyakit.id;
  let result = knn({
    kasuses,
    newKasus,
    gejalases,
    penyakit_id
  });
  result.penyakit = result_penyakit;
  return result;
}

export function kfold ({ kasuses, gejalases, penyakits, k }) {
  let shuffled = shuffle(kasuses);
  let partitions = range(k).map(i => []);
  shuffled.forEach((kasus, i) => {
    partitions[i % k].push(kasus);
  });
  return partitions.map((part, i) => {
    let trains = partitions
      .filter((other_part, j) => j != i)
      .reduce((acc, val) => {
        return [ ...acc, ...val ];
      }, []);
    let tests = part;

    const parts_result = tests.map(test_kasus => {
      let test_result = retrieve({
        kasuses: trains,
        gejalases,
        penyakits,
        newKasus: test_kasus.gejala
      });
      if (!test_result.penyakit) {
        console.log(test_result);
      }
      return test_result.penyakit.id == test_kasus.penyakit_id ? 1 : 0;
    });
    return {
      total: parts_result.length,
      hits: sum(parts_result),
      accuracy: sum(parts_result) / parts_result.length
    };
  });
}