function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';

  return fetch(
    `${BASE_URL}/name/${name}?fields=flags,name,capital,population,languages`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
      // console.log(resp.statusText);
    }
    return resp.json();
  });
}
export default fetchCountries;
