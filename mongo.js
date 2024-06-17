const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://oskaripessinen:${password}@puhelinluettelo.4nbysob.mongodb.net/numbersApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name: name,
  number: number
})
if (number && name) {
    person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })
}

else {
  Person.find({}).then(result => {
    console.log("Phonebook: ")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}