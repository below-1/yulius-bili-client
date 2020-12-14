import http from 'enjel/services/axios.js';

export default async function ({ kategori, keyword }) {
  const url = '/api/bahan_pangan/all.php';
  const params = {
    keyword,
    kategori
  };
  const response = await http.get(url, { params });
  return response.data.map(it => {
  	return {
  		id: it.id,
  		beratMax: it.berat_max,
  		beratMin: it.berat_min,
  		kebEnergi: it.keb_energi,
  		kebKarbohidrat: it.keb_karbohidrat,
  		kebLemak: it.keb_lemak,
  		kebProtein: it.keb_protein,
  		kategori: it.kategori
  	}
  });
}