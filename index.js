require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})

const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/scores', (req, res) => {
  knex
    .insert(req.body)
    .into('high_scores')
    .returning('*')
    .then(updated => updated[0])
    .then(() => res.sendStatus(201))
})

app.get('/scores', (req, res) => {
  knex('high_scores')
    .orderBy('score', 'desc')
    .limit(10)
    .then(scores => res.json(scores))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log('Listening on ' + PORT))
