<script>
  import { range } from "lodash";

  const N_PENYAKIT = 5;
  const BIAS = 1;
  const PENYAKITS = range(1, 6);
  const GEJALAS = range(1, 27);
  const KASUS_BARU = [15, 16, 23, 25];

  let gejala = new Map();
  gejala.set(1, 0.3);
  gejala.set(2, 0.9);
  gejala.set(3, 1);
  gejala.set(4, 1);
  gejala.set(5, 0.8);
  gejala.set(6, 1);
  gejala.set(7, 0.8);
  gejala.set(8, 0.8);
  gejala.set(9, 0.5);
  gejala.set(10, 0.2);
  gejala.set(11, 1);
  gejala.set(12, 0.5);
  gejala.set(13, 1);
  gejala.set(14, 0.5);
  gejala.set(15, 1);
  gejala.set(16, 1);
  gejala.set(17, 0.4);
  gejala.set(18, 1);
  gejala.set(19, 1);
  gejala.set(20, 1);
  gejala.set(21, 0.5);
  gejala.set(22, 0.1);
  gejala.set(23, 1);
  gejala.set(24, 1);
  gejala.set(25, 0.8);
  gejala.set(26, 0.9);

  const kasus = [
    { gejala: [1, 3, 5, 7], penyakit: 1 },
    { gejala: [1, 16, 17, 23], penyakit: 2 },
    { gejala: [15, 16, 23, 26], penyakit: 2},
    { gejala: [2, 8, 11], penyakit: 3 },
    { gejala: [2, 10, 13, 14], penyakit: 4 },
    { gejala: [9, 17, 19, 21, 22], penyakit: 5 },
    { gejala: [17, 20, 22], penyakit: 5 }
  ];
  let mapping_penyakit = new Map();
  let map_p_g = new Map();
  let p_prob = new Map();
  let attr_p_prob = new Map();

  for (let k of kasus) {
    if (mapping_penyakit.has(k.penyakit)) {
      mapping_penyakit.set(k.penyakit, mapping_penyakit.get(k.penyakit) + 1);
    } else {
      mapping_penyakit.set(k.penyakit, 1);
    }
  }

  Array.from(mapping_penyakit.keys()).forEach(p => {
    const total = mapping_penyakit.get(p);
    const prob = (total + BIAS) / (kasus.length + (N_PENYAKIT * BIAS));
    p_prob.set(p, prob);
    console.log(`penyakit-${p} --- [prob=${prob}] [total=${total}]`);
  });

  PENYAKITS.forEach(p => {
    let inner = new Map();
    let sub_kasuses = kasus.filter(k => k.penyakit == p);
    let n_p = sub_kasuses.length;
    GEJALAS.forEach(g => {
      const contain_g = sub_kasuses.filter(k => k.gejala.includes(g));
      const n_g = contain_g.length;
      inner.set(g, n_g);

      const nominator = n_g + BIAS;
      const denominator = mapping_penyakit.get(p) + (N_PENYAKIT * BIAS);
      const prob = nominator / denominator;
      inner.set(g, prob);
      console.log(`P(P${p}|G${g}) = ${prob}`);
    });
    attr_p_prob.set(p, inner);
  });

  // Menghitung prob gejala data baru
  console.log(p_prob);
  const probs = PENYAKITS.map(p => 
    ({
      prob: KASUS_BARU
        .map(g => attr_p_prob.get(p).get(g))
        .reduce((a, b) => a * b, 1) * p_prob.get(p),
      p
    }))
  console.log(probs);

</script>

<div>
</div>