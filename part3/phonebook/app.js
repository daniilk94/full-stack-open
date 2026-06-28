const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () =>
  String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));

const nameExists = (arr, name) => arr.some((e) => e.name === name);

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const personToReturn = persons.find((p) => p.id === id);

  if (personToReturn) {
    response.json(personToReturn);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  const personToAdd = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  } else if (nameExists(persons, body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(personToAdd);
  response.status(201).json(personToAdd);
});

app.get("/api/persons/", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people <br /> <br /> ${new Date()}</p>`,
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
