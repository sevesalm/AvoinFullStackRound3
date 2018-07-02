const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static("build"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);

const apiBase = "/api";

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
];

app.get(apiBase + "/persons", (req, res) => {
  return res.json(persons);
});

app.get(apiBase + "/persons/:id", (req, res) => {
  const person = persons.find(item => item.id === Number(req.params.id));
  if (person) {
    return res.json(person);
  } else {
    return res.status(404).end();
  }
});

app.get(apiBase + "/info", (req, res) => {
  const recordCount = persons.length;
  const date = new Date().toString();

  return res.send(
    `<p>Puhelinluettelossa ${recordCount} henkilön tiedot</p><p>${date}</p>`
  );
});

app.post(apiBase + "/persons", (req, res) => {
  const newRecord = { ...req.body };

  if (newRecord.name == null) {
    return res.status(400).json({ message: "Missing name" });
  }
  if (newRecord.number == null) {
    return res.status(400).json({ message: "Missing number" });
  }

  if (persons.find(item => item.name == newRecord.name)) {
    // Code 409 might also be considered here
    return res.status(400).json({ message: "Name already exists" });
  }

  newRecord.id = Math.floor(Math.random() * 1000000000);
  persons.push(newRecord);
  res.json(newRecord);
});

app.delete(apiBase + "/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(item => item.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
