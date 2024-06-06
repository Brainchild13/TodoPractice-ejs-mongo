require('dotenv').config() // Load env Variables
const express = require('express') // Import express
const app = express()
const morgan = require('morgan') // Import morgan
const methodOverride = require('method-override')
const mongoose = require('mongoose')

/////////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
    .on('open', () => console.log('\n\tConnected to Mongoose\n'))
    .on('close', () => console.log('\n\tDisconnected from Mongoose\n'))
    .on('error', (error) => console.log(error))

//////////////////////////////////////////////////
// Our Models
//////////////////////////////////////////////////
// pull schema and model from mongoose
const { Schema, model } = mongoose

// Make todo schema
const todoSchema = new Schema({
    text: String
})


// make todo model
const Todo = model('Todo', todoSchema)

///////////////////////////////////////////////////
// Middleware
///////////////////////////////////////////////////
app.use(morgan('tiny')) // Logging
app.use(methodOverride('_method')) // override for put and delete requests from froms
app.use('/static', express.static('static')) // Server files from public statically

//////////////////////////////////////////////////
// Routes
//////////////////////////////////////////////////
app.get('/', async (req, res) => {

    // Get todos
    const todos = await Todo.find({})

    // Render index.ejs
    res.render('index.ejs', { todos: todos })
})

app.get('/seed', async (req, res) => {

    //Delete all existing todos
    // await Todo.remove({})

    // Add sample todos
    await Todo.create([{ text: "Eat Breakfast" }, { text: "Eat Lunch" }, { text: "Eat Dinner" }])

    // redirect back to main page
    res.redirect('/')
})

app.post('/todo', async (req, res) => {

    // Create the new todo
    await Todo.create(req.body)
    // redirect to main page
    res.redirect('/')
})

app.delete('/todo/:id', async (req, res) => {

    // Get the id from params
    const id = req.params.id
    // delete the todo
    await Todo.findByIdAndDelete(id)
    // redirect to main page
    res.redirect('/')
})
//////////////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`\n\tNow listening on http://localhost:${PORT}\n`))