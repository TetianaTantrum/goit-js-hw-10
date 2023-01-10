import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  clearMarkup();
  const input = evt.target;
  fetchCountries(input.value.trim())
    .then(countries => {
      clearMarkup();
      if (countries.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
        return;
      }
      if (10 >= countries.length && countries.length >= 2) {
        countryInfo.innerHTML = '';

        createMarkupCountriesList(countries);
      } else {
        countriesList.innerHTML = '';
        createMarkupCountry(countries);
      }
    })
    .catch(err => {
      createErrorMessage(err);
    });
}
// function fetchCountries(name) {
//   const BASE_URL = 'https://restcountries.com/v3.1';

//   return fetch(
//     `${BASE_URL}/name/${name}?fields=flags,name,capital,population,languages`
//   ).then(resp => {
//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//       // console.log(resp.statusText);
//     }
//     return resp.json();
//   });
// }
function createMarkupCountriesList(countries) {
  const markup = countries.map(
    ({ flags: { svg: flagsSvg }, name: { official: officialName } }) => {
      return ` <li class="country-flag item">
          <img height="20" src="${flagsSvg}" alt="${officialName}">
          <p class="country-name">${officialName}</p>
          </li>`;
    }
  );
  countriesList.innerHTML = markup.join('');
}
function createMarkupCountry(countries) {
  const markup = countries.map(
    ({
      flags: { svg: flagsSvg },
      name: { official: officialName },
      capital,
      population,
      languages,
    }) => {
      return ` 
        <div class="wrapper">
        <div class="country-flag">
          <img class = "flag-icon" height="20" src="${flagsSvg}" alt="${officialName}">
          <h2 class="country-name">${officialName}</h2>
          </div>
          <p class="capital"><span class="bold">Capital:</span> ${capital}</p>
          <p class="population"><span class="bold">Population:</span> ${population}</p>
          <p class="languages"><span class="bold">Languages:</span> ${Object.values(
            languages
          )}</p>
        </div>`;
    }
  );
  countryInfo.innerHTML = markup.join('');
}
function createErrorMessage(err) {
  Notiflix.Notify.failure(`Oops, there is no country with that name`);
}
function clearMarkup() {
  countryInfo.innerHTML = '';
  countriesList.innerHTML = '';
}
