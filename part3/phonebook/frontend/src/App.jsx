import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import contactService from "./services/contacts";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterValue, setNewFilterValue] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  const showNotification = (action, error) => {
    switch (action) {
      case "numberExists":
        setNotificationMessage({
          text: `Number ${newNumber} is already added to phonebook with another name`,
          type: "error",
        });
        break;
      case "personNotFound":
        setNotificationMessage({
          text: `Information of ${newName} has already been deleted from server`,
          type: "error",
        });
        break;
      case "personCreated":
        setNotificationMessage({
          text: `Added ${newName}`,
          type: "success",
        });
        break;
      case "personUpdated":
        setNotificationMessage({
          text: `The number of ${newName} has been successfully changed to ${newNumber}`,
          type: "success",
        });
        break;
      case "personDeleted":
        setNotificationMessage({
          text: `Chosen person deleted`,
          type: "success",
        });
        break;
      case "unknownError":
        setNotificationMessage({
          text: `${error}`,
          type: "error",
        });
        break;
      default:
        break;
    }

    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const getPersons = () => {
    contactService.getAll().then((personsList) => setPersons(personsList));
  };

  useEffect(getPersons, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((p) => p.name === newName);
    const numberExists = persons.some((person) => person.number === newNumber);

    //Update section
    if (existingPerson) {
      const changedPerson = {
        ...existingPerson,
        name: newName,
        number: newNumber,
      };

      if (
        window.confirm(
          `${newName} is already added to phonebook. replace the old number with a new one?`,
        )
      ) {
        if (numberExists) {
          showNotification("numberExists");
          return;
        }
        handleUpdate(existingPerson, changedPerson);
      }
      return;
    }

    //Create section
    if (numberExists) {
      showNotification("numberExists");
      return;
    }

    contactService
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        showNotification("personCreated");
      })
      .catch((error) => {
        showNotification("unknownError", error.response.data.error);
      });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`))
      contactService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          showNotification("personDeleted");
        })
        .catch((e) => {
          console.log(e.message);
          setPersons(persons.filter((p) => p.id !== person.id));
          showNotification("personDeleted");
        });
  };

  const handleUpdate = (existingPerson, changedPerson) => {
    contactService
      .update(existingPerson.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id === existingPerson.id ? returnedPerson : p)),
        );
        setNewName("");
        setNewNumber("");
        showNotification("personUpdated");
      })
      .catch((error) => {
        console.log(error.message);
        if (error.response.status === 404) {
          setPersons(persons.filter((p) => p.id !== changedPerson.id));
          showNotification("personNotFound");
        } else {
          showNotification("unknownError", error.response.data.error);
        }
      });
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
      <Notification message={notificationMessage} />
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
      <Persons persons={personsDisplay} onClickDelete={handleDelete} />
    </div>
  );
};

export default App;
