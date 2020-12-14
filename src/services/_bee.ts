import { range, random, zip, sum, max } from 'lodash';

function fBBI(usia: number) {
  const _u = usia * 2;
  return parseFloat(`${Math.floor(_u / 12)}.${_u % 12}`) + 8;
}

function rouletteWheel (weights: number[], items: number[]) {
  const max = sum(weights);
  const pick = random(0, max, false);
  let current = 0;
  for (let i = 0; i < weights.length; i++) {
    current += weights[i];
    if (current >= pick) {
      return items[i]
    }
  }
  throw new Error(`Just Stop Copy Pasting From StackOverflow!!!`);
}


type Solution = {
  items: number[],
  weights: number[],
  trial: number
};

type Kategori = 'karbohidrat' | 'protein' | 'lemak';
const ALL_KATEGORI: Kategori[] = ['karbohidrat', 'protein', 'lemak'];

export type BahanPangan = {
  kategori: string;
  id: number;
  nama: string;
  beratMin: number;
  beratMax: number;
  kebEnergi: number;
  kebKarbohidrat: number;
  kebLemak: number;
  kebProtein: number;
}

function chooseRandomly<T>(data: T[]): T | undefined {
  if (!data.length) return undefined;
  const r = random(0, data.length - 1, false);
  return data[r];
}

function randIntNotEqual(lower: number, upper: number, hated: number) {
  let c = random(lower, upper, false);
  while (c == hated) {
    c = random(lower, upper, false);
  }
  return c;
}

function copySolution (s: Solution) : Solution {
  return {
    items: [...s.items],
    weights: [...s.weights],
    trial: s.trial
  }
}

export class GiziBee {

  private readonly data: BahanPangan[];
  private readonly food: number;
  private readonly dimension: number;
  private readonly limit: number;
  private readonly maxIter: number;
  private readonly upperBounds: number[];
  private readonly lowerBounds: number[];
  private readonly onlookers: number;

  public solutions: Solution[] = [];
  private categoryMap: Map<Kategori, number[]> = new Map();
  private mapPangan: Map<number, BahanPangan> = new Map();

  /**
   * PROPERTIES
   * 
   * --- Parameters
   * food
   * dimension
   * limit
   * maxIter
   * 
   * --- States
   * populations: 
   *    [ 
   *      [ [ item, item, item ], [ weight, weight, weight ] ]
   *      [ [ item, item, item ], [ weight, weight, weight ] ]
   *      [ [ item, item, item ], [ weight, weight, weight ] ]
   *      ...
   *    ]
   */
  
  constructor (options: {
    data: BahanPangan[],
    food: number,
    dimension: number,
    maxIter: number | undefined,
    upperBounds: number[],
    lowerBounds: number[],
    onlookers: number | undefined
  }) {
    // Parameters of ABC
    this.data = options.data;
    this.food = options.food ? options.food : 50;
    this.dimension = options.dimension ? options.dimension : 3;
    this.limit = this.food / 2.0;
    this.maxIter = options.maxIter ? options.maxIter : 1000;
    this.lowerBounds = options.lowerBounds;
    this.upperBounds = options.upperBounds;
    this.onlookers = options.onlookers ? options.onlookers : this.food / 2;
  }

  public initSolutions () {
    // construct list of each category (karb, pro, lem)
    this.categoryMap.clear();
    this.mapPangan.clear();

    ALL_KATEGORI.forEach(k => {
      this.categoryMap.set(k, []);
    });
    
    this.data.forEach(pangan => {
      this.mapPangan.set(pangan.id, pangan);
    });

    this.solutions = [];
 
    for (let i = 0; i < this.food; i++) {
      const food = this.generateSolution();
      this.solutions.push(food);
    }
  }

  initTarget (usia: number) {
    const bbi = fBBI(usia);
    const targetKalor = 100 * bbi;
    const kebProtein = 0.1 * targetKalor / 4.0;
    const kebLemak = 0.2 * targetKalor / 9.0;
    const kebKarbohidrat = 0.7 * targetKalor / 4.0;
    const target = [
      targetKalor / 3.0, kebProtein / 3.0, 
      kebLemak / 3.0, kebKarbohidrat / 3.0];
    return target;
  }

  scrapeNeighbour(indexSolution: number, l: number, u: number) {
    const _l = l ? l : 0;
    const _u = u ? u : 0;
    const solution = this.solutions[indexSolution];
    const jdex = randIntNotEqual(0, this.food - 1, indexSolution);
    const k = random(0, this.dimension);
    const other = this.solutions[jdex];
    if (!other) {
      console.log('error');
      console.log(`jdex = ${jdex}`);
      throw new Error();
    }
    const xi = solution.weights;
    const xj = other.weights;
    let newWeights = [...solution.weights];
    newWeights[k] = xi[k] + random(_l, _u, true) * (xi[k] - xj[k]);

    if (newWeights[k] > this.upperBounds[k] || newWeights[k] < this.lowerBounds[k]) {
      newWeights[k] = random(this.lowerBounds[k], this.upperBounds[k], true);
    }
    const foundNan = newWeights.find(w => isNaN(w));
    if (foundNan) {
      console.log('old');
      console.log(solution.weights)
      console.log('new');
      console.log(newWeights);
      console.log('error');
      throw new Error();
    }
    return newWeights;
  }

  translateComponents (solution: Solution) {
    const comps = solution.items
      .map((id, index) => {
        const pangan = this.mapPangan.get(id)!;
        const kand = solution.weights[index];
        const bases = [
          pangan.kebEnergi,
          pangan.kebProtein,
          pangan.kebLemak,
          pangan.kebKarbohidrat
        ];
        return bases.map(oldW => 
          (kand / pangan.beratMin) * oldW
        )
      });
    const total = comps
      .reduce((a, b) => 
        zip(a, b)
          .map(pair => pair[0]! + pair[1]!));
    return total;
  }

  countPenalty (solution: Solution, target: number[]) {
    const comps = solution.items
      .map((id, index) => {
        const pangan = this.mapPangan.get(id)!;
        const kand = solution.weights[index];
        const bases = [
          pangan.kebEnergi,
          pangan.kebProtein,
          pangan.kebLemak,
          pangan.kebKarbohidrat
        ];
        return bases.map(oldW => 
          (kand / pangan.beratMin) * oldW
        )
      });
    const total = comps
      .reduce((a, b) => 
        zip(a, b)
          .map(pair => pair[0]! + pair[1]!));
    const diff = zip(target, total)
      .map(pair => pair[0]! - pair[1]!);
    const penalty = diff.map(x => x < 0 ? 0 : 1);
    const totalPenalty = sum(penalty);
    return totalPenalty;
  }

  private isSolutionInvalid (index: number) {
    return this.solutions[index].trial > this.limit;
  }

  private generateSolution () {
    let indices: number[] = [];
    let items: number[] = [];
    while (indices.length < this.dimension) {
      let index = random(0, this.data.length - 1);
      while (indices.includes(index)) {
        index = random(0, this.data.length - 1);
      }
      indices.push(index);
      items.push(this.data[index].id);
    }
    const weights = range(this.dimension)
      .map(i => random(this.lowerBounds[i], this.upperBounds[i]));
    const food: Solution = {
      items,
      weights,
      trial: 0
    };
    return food;
  }

  private improveSolution (index: number, target: number[], penalties: number[], beeType: 'onlooker' | 'employed') {
    let l: number;
    let u: number;
    if (beeType == 'onlooker') {
      l = 0;
      u = 1;
    } else {
      l = -1;
      u = 1;
    }
    const solution = this.solutions[index];
    const newWeights = this.scrapeNeighbour(index, l, u);
    let newSolution = copySolution(solution);
    newSolution.weights = newWeights;
    // console.log(solution);
    // console.log(newSolution);
    // throw new Error();
    const vPenalty = this.countPenalty(newSolution, target);

    if (vPenalty < penalties[index]) {
      // replace with neighbour's weights
      this.solutions[index].weights = newWeights;
      this.solutions[index].trial = 0;
    } else {
      this.solutions[index].trial += 1;
    }
  }

  public optimize (usia: number) {
    // Initialize our bees
    this.initSolutions();
    const target = this.initTarget(usia);
    console.log('target');
    console.log(target);
    console.log();
    let iteration = 0;
    let minPenalty = 0;
    let bestIndex = 0;
    let bestFitness = 0;
    let bestSolution = copySolution(this.solutions[bestIndex]);

    let penalties = this.solutions.map(solution => this.countPenalty(solution, target));
    let maxPenalty = max(penalties)!;
    // this.solutions.forEach((sol, index) => {
    //   console.log(`items: ${sol.items}`);
    //   console.log(`weights: ${sol.weights}`)
    //   console.log(`penalty: ${penalties[index]}`)
    // })
    // console.log('');
    // return 'ok';

    while (iteration < this.maxIter) {

      // do some bee stuff.
      let penalties = this.solutions.map(solution => this.countPenalty(solution, target));
      let fitnesses = penalties.map(p => (1 / (1.0 + p)));

      // Record the best food.
      for (let index = 0; index < this.food; index++) {
        if (fitnesses[index] > fitnesses[bestIndex]) {
          bestIndex = index;
          bestSolution = copySolution(this.solutions[bestIndex]);
          bestFitness = fitnesses[index];
          minPenalty = penalties[index];
          console.log(`penalty = ${minPenalty}`)
          console.log(1 / (1.0 + minPenalty));
          console.log(`fitness = ${bestFitness}`)
          console.log(bestSolution);
          console.log(`real penalty = ${this.countPenalty(bestSolution, target)}`);;
          console.log(this.translateComponents(bestSolution));
          console.log('---');
          console.log();
        }
      }

      // Employed
      for (let index = 0; index < this.food; index++) {
        this.improveSolution(index, target, penalties, 'employed');
      }

      const totalFit = sum(fitnesses);
      const probs = fitnesses.map(f => f / totalFit);

      // OnLookers
      for (let i = 0; i < this.onlookers; i++) {
        const selectedIndex = rouletteWheel(probs, range(this.food));
        this.improveSolution(selectedIndex, target, penalties, 'onlooker');
      }

      // Scout
      iteration += 1;
      console.log(`min penalty [${minPenalty}]`);
      // console.log(`iteration [${iteration}]`);
      // console.log(`best fitness [${bestFitness}]`);
    }

    // console.log(bestSolution);
    // console.log(this.translateComponents(bestSolution));
    return bestSolution;
  }

  public test() {
    console.log(this.mapPangan);
    const solution: Solution = {
      items: [1, 51, 32],
      weights: [129, 210, 280],
      trial: 0
    };
    const target = [370, 9.25, 8.22, 64.75];
    console.log(this.translateComponents(solution));
    console.log(this.countPenalty(solution, target));
  }

}