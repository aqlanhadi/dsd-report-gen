const serverless = require('serverless-http')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const responseHandler = require('./services/responseHandler')

app.use(bodyParser.json())

const PORT = process.env.PORT || 3200

app.post('/hook', async (req, res) => {
    
    //console.log(req.body)
    await responseHandler.handle(req.body.form_response)
    .then(() => {
        console.log(`Service completed.`)
        res.send({
            status: 200,
            body: `Response processed.`
        })
    })
})

app.get('/', (req, res) => {
    res.send(`(c) ${new Date().getFullYear()} Digital Skills Development`)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

module.exports.handler = serverless(app)