const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(dbUrl);

const Person = mongoose.model("Person", {
  name: String,
  number: String
});

switch (process.argv.length) {
  case 4:
    const name = process.argv[2];
    const number = process.argv[3];
    const person = new Person({
      name,
      number
    });
    person
      .save()
      .then(() =>
        console.log(`Lisätään henkilö ${name} numero ${number} luetteloon`)
      )
      .then(() => mongoose.connection.close());
    break;
  default:
    Person.find()
      .then(result => {
        console.log("Puhelinluettelo:");
        result.forEach(person =>
          console.log(`${person.name} ${person.number}`)
        );
      })
      .then(() => mongoose.connection.close());
    break;
}
