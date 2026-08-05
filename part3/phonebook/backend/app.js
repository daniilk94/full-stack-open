require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const Person = require("./models/person");
const app = express();

morgan.token("body", function getBody(req) {
  return JSON.stringify(req.body);
});

const postData =
  ":method :url :status :res[content-length] - :response-time ms :body";

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan("tiny", {
    skip: function (req, res) {
      return req.method === "POST";
    },
  }),
);

app.use(
  morgan(`${postData}`, {
    skip: function (req, res) {
      return req.method !== "POST";
    },
  }),
);

const nameExists = (name) => {
  Person.find({ name: name }).then((person) => person.length !== 0);
};

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => response.status(404).end());
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  const personToAdd = new Person({
    name: body.name,
    number: body.number,
  });

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  Person.find({ name: body.name }).then((person) => {
    if (person.length !== 0) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }

    personToAdd.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people <br /> <br /> ${new Date()}</p>`,
    );
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
