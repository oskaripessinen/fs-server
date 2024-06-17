require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const PORT = process.env.PORT || 3001;

console.log(PORT);





app.use(express.static('dist'))
app.use(express.json())

app.use(morgan("tiny"))
app.use(cors())




app.get('/info', (request, response) => {
  const currentTime = new Date();

  Person.countDocuments({})
      .then(count => {
          response.send(
              `<p>Phonebook has info for ${count} people</p>
              <p>${currentTime}</p>`
          );
      })
      .catch(error => {
          console.error('Error fetching count:', error);
          response.status(500).send('Error fetching count');
      });
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      
    })
    .catch(error => next(error))
    
    
  })

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({error: "Person not found"});
      }
      
    })
    .catch(error => next(error))

  response.status(204).end()
})

app.get('/api/persons', (request, response, next) => {
  
  Person.find({}).then(result => {
    response.json(result);
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body.name);


    if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
    }
    if (!body.number) {
        return response.status(400).json({ 
        error: 'Number missing' 
        })
    }
    
  
    
  Person.findOne({ name: body.name })
      .then(existingPerson => {
          if (existingPerson) {
              
              existingPerson.number = body.number; 
              return existingPerson.save(); 
          } else {

              const newPerson = new Person({
                  name: body.name,
                  number: body.number,
              });
              return newPerson.save(); 
          }
      })
      .catch(error => next(error))

      .then(savedPerson => {

          response.json(savedPerson);
      })
      .catch(error => {
      
          next(error);
      });  
  })



app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log("dsad");

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }


  next(error)
}


app.use(errorHandler)


app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})