const mongoose = require("mongoose");
const args = process.argv;

if (args.length < 3 || args.length === 4) {
  console.log("Provide argumentss as follows: <your_password> <name> <number>");
  process.exit(1);
} else if (args.length > 5) {
  console.log(
    `Too many argumentss!\nNote that if the name contains whitespace, it must be enclosed in quotes as follows:\n< "firstname lastname" >`,
  );
  process.exit(1);
}

const password = args[2];

const url = `mongodb+srv://admin:${password}@clust.vlxmraa.mongodb.net/phonebook?appName=Clust`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (args.length === 3) {
  console.log("Phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
  return;
}

const person = new Person({
  name: args[3],
  number: args[4],
});

person.save().then((result) => {
  console.log(`added ${result.name} number ${result.number} to phonebook`);
  mongoose.connection.close();
});
