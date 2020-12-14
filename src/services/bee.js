import { range, random, zip, sum, max } from 'lodash';

const ALL_KATEGORI = ['karbohidrat', 'protein', 'lemak'];

function fBBI(usia) {
    const _u = usia * 2;
    return parseFloat(`${Math.floor(_u / 12)}.${_u % 12}`) + 8;
}

function rouletteWheel (weights, items) {
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

function chooseRandomly(data) {
    if (!data.length) return undefined;
    const r = random(0, data.length - 1, false);
    return data[r];
}

function randIntNotEqual(lower, upper, hated) {
    let c = random(lower, upper, false);
    while (c == hated) {
        c = random(lower, upper, false);
    }
    return c;
}

function copySolution (s) {
    return {
        items: [...s.items],
        weights: [...s.weights],
        trial: s.trial
    }
}

export class GiziBee {

    constructor (options) {
        console.log(options);
        this.data = options.data;
        this.food = options.food ? options.food : 50;
        this.dimension = options.dimension ? options.dimension : 3;
        this.limit = options.limit;
        this.maxIter = options.maxIter ? options.maxIter : 1000;
        this.lowerBounds = options.lowerBounds;
        this.upperBounds = options.upperBounds;
        this.onlookers = options.onlookers ? options.onlookers : this.food / 2;

        this.solutions = [];
        this.categoryMap = new Map();
        this.mapPangan = new Map();
    }

    initSolutions () {
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

    scrapeNeighbour(indexSolution, l, u) {
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

    countPenalty (solution, target) {
        const comps = solution.items
            .map((id, index) => {
                const pangan = this.mapPangan.get(id);
                const kand = solution.weights[index];
                const bases = [
                    pangan.kebEnergi,
                    pangan.kebProtein,
                    pangan.kebLemak,
                    pangan.kebKarbohidrat
                ];
                return bases.map(oldW => (kand / pangan.beratMin) * oldW)
            });
        const total = comps
            .reduce((a, b) => 
                zip(a, b)
                .map(pair => pair[0] + pair[1]));
        const diff = zip(target, total)
            .map(pair => Math.abs(pair[0] - pair[1]));
        // const penalty = diff.map(x => x < 0 ? 0 : 1);
        const totalPenalty = sum(diff);
        return totalPenalty;
    }

    isSolutionInvalid (index) {
        return this.solutions[index].trial > this.limit;
    }

    calcFitness (solution, target) {
        const comps = solution.items
            .map((id, index) => {
                const pangan = this.mapPangan.get(id);
                const kand = solution.weights[index];
                const bases = [
                    pangan.kebEnergi,
                    pangan.kebProtein,
                    pangan.kebLemak,
                    pangan.kebKarbohidrat
                ];
                return bases.map(oldW => (kand / pangan.beratMin) * oldW)
            });
        const total = comps
            .reduce((a, b) => 
                zip(a, b)
                .map(pair => pair[0] + pair[1]));

        // There is some component that less than target
        const hardConstraintViolation = total.some((t, it) => {
            return t < target[it];
        });

        if (hardConstraintViolation) {
            return 0;
        }

        const diff = zip(target, total)
            .map(pair => Math.abs(pair[0] - pair[1]));
        // const penalty = diff.map(x => x < 0 ? 0 : 1);
        const totalPenalty = sum(diff);
        const result = 1 / totalPenalty;
        if (isNaN(result)) {
            console.log("solution.items");
            console.log(solution.items);
            console.log("diff");
            console.log(diff);
            console.log("target");
            console.log(target);
            console.log("total");
            console.log(total);
            console.log("comps");
            console.log(comps);
            throw new Error();
            return 0;
        }
        return result; 
    }

    generateSolution () {
        let indices = [];
        let items = [];
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
        const food = {
          items,
          weights,
          trial: 0
        };
        return food;
    }

    improveSolution (index, target, fitnesses, beeType) {
        let l;
        let u;
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
        const newFit = this.calcFitness(newSolution, target);

        if (newFit > fitnesses[index]) {
          // replace with neighbour's weights
          this.solutions[index] = newSolution;
          this.solutions[index].trial = 0;
        } else {
          this.solutions[index].trial += 1;
        }
    }

    translateComponents (solution) {
        const comps = solution.items
          .map((id, index) => {
            const pangan = this.mapPangan.get(id);
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
              .map(pair => pair[0] + pair[1]));
        return total;
    }

    initTarget (usia) {
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

    optimize (usia) {
        // Initialize our bees
        this.initSolutions();
        const target = this.initTarget(usia);
        let iteration = 0;
        let minPenalty = 0;
        let bestIndex = 0;
        let bestFitness = 0;
        let bestSolution = copySolution(this.solutions[bestIndex]);

        // let penalties = this.solutions.map(solution => this.countPenalty(solution, target));
        // let maxPenalty = max(penalties);
        // console.log(penalties);
        // throw new Error();
        // this.solutions.forEach((sol, index) => {
        //   console.log(`items: ${sol.items}`);
        //   console.log(`weights: ${sol.weights}`)
        //   console.log(`penalty: ${penalties[index]}`)
        // })
        // console.log('');
        // return 'ok';

        while (iteration < this.maxIter) {

            // do some bee stuff.
            let fitnesses = this.solutions.map(s => this.calcFitness(s, target));
            // console.log(fitnesses);
            // throw new Error();

            // Record the best food.
            for (let index = 0; index < this.food; index++) {
                if (fitnesses[index] > bestFitness) {
                    // console.log('prevBestFit');
                    // console.log(bestFitness);
                    // console.log('currentBestFit');
                    // console.log(fitnesses[index]);
                    bestIndex = index;
                    bestSolution = copySolution(this.solutions[bestIndex]);
                    bestFitness = fitnesses[index];
                    // minPenalty = penalties[index];
                    // console.log(`penalty = ${minPenalty}`)
                    // console.log(1 / (1.0 + minPenalty));
                    // console.log(`fitness = ${bestFitness}`)
                    // console.log(bestSolution);
                    // console.log(`real penalty = ${this.countPenalty(bestSolution, target)}`);;
                    // console.log(this.translateComponents(bestSolution));
                    // console.log('---');
                }
            }

            // Employed
            for (let index = 0; index < this.food; index++) {
                this.improveSolution(index, target, fitnesses, 'employed');
            }

            const totalFit = sum(fitnesses);
            const probs = fitnesses.map(f => f / totalFit);
            for (let i = 0; i < this.onlookers; i++) {
                const selectedIndex = rouletteWheel(probs, range(this.food));
                this.improveSolution(selectedIndex, target, fitnesses, 'onlooker');
            }

            // Scout
            let nRemoved = 0;
            for (let i = 0; i < this.solutions.length; i++) {
                const solution = this.solutions[i];
                if (solution.trial > this.limit) {
                    this.solutions[i] = this.generateSolution();
                    nRemoved += 1;
                }
            }


            iteration += 1;
            // console.log(`min penalty [${minPenalty}]`);
            // console.log(`iteration [${iteration}]`);
            // console.log(`best fitness [${bestFitness}]`);
            // console.log(`scout removed [${nRemoved}]`);
            // console.log();
        }

        console.log("bestSolution");
        console.log(bestSolution);
        console.log("translateSolution");
        console.log(this.translateComponents(bestSolution));
        console.log("target");
        console.log(target);
        return bestSolution;
    }

    test() {
        const solution = {
          items: [1, 51, 32],
          weights: [129, 210, 280],
          trial: 0
        };
        const target = [370, 9.25, 8.22, 64.75];
        console.log(this.translateComponents(solution));
        console.log(this.countPenalty(solution, target));
    }
}