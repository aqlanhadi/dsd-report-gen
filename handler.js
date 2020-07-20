const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const responseHandler = require('./services/responseHandler')

app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

app.post('/hook', (req, res) => {
    
    //console.log(req.body)
    responseHandler.handle(req.body.form_response)

    res.send({
        status: 200,
        body: `Response received.`
    })
})

app.get('/', (req, res) => {
    res.send(`(c) ${new Date().getFullYear()} Digital Skills Development`)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports.handler = serverless(app)