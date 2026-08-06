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

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "wrong id format" });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.static("dist"));
app.use(express.json());
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

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const number = request.body.number;
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }

      person.number = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
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

  personToAdd
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has info for ${persons.length} people <br /> <br /> ${new Date()}</p>`,
      );
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
