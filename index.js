const express = require('express')
const knex = require('knex')({
  dialect: 'pg',
  connection: 'postgres://localhost:5432/hire-me'
})

const app = express()

app.use(express.static('public'))

app.post('/scores', (req, res) => {
  knex
    .insert(req.body)
    .into('high_scores')
    .returning('*')
    .then(updated => updated[0])
    .then(() => res.sendStatus(201))
})

app.listen(3000, console.log('Listening on 3000...'))
