const express = require('express')
const bodyParser = require('body-parser')
const knex = require('knex')({
  dialect: 'pg',
  connection: 'postgres://localhost:5432/banana-road'
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

app.listen(3000, console.log('Listening on 3000...'))
