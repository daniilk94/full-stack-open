const Persons = ({ persons, onClickDelete }) =>
  persons.map((person) => (
    <p key={person.id}>
      {person.name} {person.number}{" "}
      <button onClick={() => onClickDelete(person)}>delete</button>
    </p>
  ));

export default Persons;
