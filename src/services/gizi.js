export function fBBI(usia) {
  return parseFloat(`${Math.floor(usia / 12)}.${usia % 12}`) + 8;
}

export function kebutuhanProtein(kalori) {
  return 0.1 * kalori / 4;
}

export function kebutuhanLemak(kalori) {
  return 0.2 * kalori / 9;
}

export function kebutuhanKarbohidrat(kalori) {
  return 0.7 * kalori / 4;
}

export function kebGizi () {
  const bbi = fBBI(usia);
  const targetKalor = 100 * bbi;
  const kebProtein = 0.1 * targetKalor / 4.0;
  const kebLemak = 0.2 * targetKalor / 9.0;
  const kebKarbohidrat = 0.7 * targetKalor / 4.0;
  return {
    targetKalor,
    kebProtein,
    kebLemak,
    kebKarbohidrat
  }
}