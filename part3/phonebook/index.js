const express = require('express')
const morgan = require('morgan');
const app = express()

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let notes = [
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(notes)
  })
  
app.get('/info', (request, response) => {
    const d = new Date()
    const resp = `<p>Phonebook has info for ${notes.length} people<p>
    ${d}`
    response.send(resp)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id == id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const id = Math.random() * 1000
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (notes.some(person => body.name == person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const note = {
        "id": id,
        "name" : body.name,
        "number": body.number,
    }

    notes = notes.concat(note)
    response.json(notes)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })