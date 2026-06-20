import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import Display from "./components/Display";
import infoService from "./services/getinfo";

const App = () => {
  const [filterValue, setNewFilterValue] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    infoService.getAll().then((countriesList) => setCountries(countriesList));
  }, []);

  const handleFiltering = (event) => {
    setNewFilterValue(event.target.value);
  };

  const countriesDisplay = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterValue.toLowerCase()),
  );

  const handleShowCountry = (name) => {
    setNewFilterValue(name)    
  };

  return (
    <div>
      <SearchBar value={filterValue} onChange={handleFiltering} />
      <Display countries={countriesDisplay} onShow={handleShowCountry} />
    </div>
  );
};

export default App;
