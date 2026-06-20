const SearchBar = ({ value, onChange }) => {
  const barStyle = {
    border: "2px solid black",
    borderRadius: 5
  };
  return (
    <div>
      find countries{" "}
      <input value={value} onChange={onChange} style={barStyle} />
    </div>
  );
};

export default SearchBar;
