import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setNewFilterValue] = useState("");

  const fetchData = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  };

  useEffect(fetchData, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    const nameExists = persons.some((person) => person.name === newName);
    const numberExists = persons.some((person) => person.number === newNumber);

    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    } else if (numberExists) {
      alert(`${newNumber} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPerson));
    }
    
    setNewName("");
    setNewNumber("");
  };

  const handleFiltering = (event) => {
    setNewFilterValue(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const personsDisplay = persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterValue} onChange={handleFiltering} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons persons={personsDisplay} />
    </div>
  );
};

export default App;
