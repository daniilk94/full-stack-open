import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY;

const urlForAll = "https://studies.cs.helsinki.fi/restcountries/api/all";
const urlForOne = "https://studies.cs.helsinki.fi/restcountries/api/name";

const getWeather = (lat, lon) => {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`,
    )
    .then((response) => response.data)
    .catch((e) => console.log(e.message));
};

const getAll = () => {
  return axios
    .get(urlForAll)
    .then((response) => response.data)
    .catch((e) => console.log(e.message));
};

const getOne = (countryName) => {
  return axios
    .get(`${urlForOne}/${countryName}`)
    .then((response) => response.data);
};

export default {
  getAll,
  getOne,
  getWeather,
};
