const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const Person = require("./models/person");

app.use(bodyParser.json());
app.use(express.static("build"));

morgan.token("body", (req, _) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);

const apiBase = "/api";

app.get(apiBase + "/persons", (req, res) => {
  Person.find()
    .then(persons => persons.map(Person.format))
    .then(formattedPersons => res.json(formattedPersons))
    .catch(err => console.log(err));
});

app.get(apiBase + "/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(
      person =>
        person ? res.json(Person.format(person)) : res.status(404).end()
    )
    .catch(err => {
      console.log(err);
      res.status(400).send({ error: "malformatted id" });
    });
});

app.get(apiBase + "/info", (req, res) => {
  const date = new Date().toString();
  Person.count().then(count =>
    res.send(`<p>Puhelinluettelossa ${count} henkilön tiedot</p><p>${date}</p>`)
  );
});

app.post(apiBase + "/persons", (req, res) => {
  const newRecord = req.body;

  if (newRecord.name == null) {
    return res.status(400).json({ message: "Missing name" });
  }
  if (newRecord.number == null) {
    return res.status(400).json({ message: "Missing number" });
  }

  return Person.find({ name: newRecord.name }).then(result => {
    console.log(result);
    if (!result.length) {
      const person = new Person(newRecord);
      person
        .save()
        .then(savedPerson => res.json(Person.format(savedPerson)))
        .catch(err => console.log(err));
    } else {
      return res.status(400).json({ message: "Name already exists" });
    }
  });
});

app.put(apiBase + "/persons/:id", (req, res) => {
  const { name, number } = req.body;

  const newRecord = { name, number };

  Person.findByIdAndUpdate(req.params.id, newRecord, { new: true })
    .then(
      updatedPerson =>
        updatedPerson
          ? res.json(Person.format(updatedPerson))
          : res.status(404).end()
    )
    .catch(err => {
      console.log(err);
      res.status(400).send({ error: "malformatted id" });
    });
});

app.delete(apiBase + "/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(() => res.status(400).send({ error: "malformatted id" }));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
