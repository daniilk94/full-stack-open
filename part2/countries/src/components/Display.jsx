import CountryInfo from "./CountryInfo";

const Display = ({ countries, onShow }) => {
  const listStyle = {
    margin: 0,
    padding: 0,
  };

  if (countries.length === 250) {
    return <p>Start typing to specify country</p>;
  } else if (countries.length > 10) {
    return <p>Too many matches, please specify another filter</p>;
  } else if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />;
  }



  return countries.map((country) => (
    <p key={country.cca3} style={listStyle}>
      {country.name.common}{" "}
      <button onClick={() => onShow(country.name.common)}> Show </button>
    </p>
  ));
};

export default Display;
