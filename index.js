const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

app.use(morgan("tiny"))
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number : "040-123456"
  },
  {
    id:2,
    name: "Ada Lovelace",
    number : "39-44-5323253"
  }
]

app.get('/info', (request, response) => {
    const currentTime = new Date()
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${currentTime}</p>`
      )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
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
    
    if(persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'Name already in phonebook'
            })
    }
  
    const person = {
        
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000),
      
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})