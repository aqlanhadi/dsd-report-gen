const utility = require('./utility')
const profiler = require('./profiler')
const mailer = require('./mailer')

class Report {

    data = {}

    constructor() {
        console.log(`Profiler invoked.`)
    }

    async initialize(body) {
        console.log('\tHidden Data:', JSON.stringify(body.hidden))
        console.log('\tResponse Data:', JSON.stringify(body.answers))
    
        return await utility.extractor(body)
            .then(async extractedData => {
                return await utility.calculateItemsFrom(extractedData)
            })
            .then(async (extractedData) => {
                console.log('Before profiled', extractedData)
                return await profiler.profile(extractedData)
            })
            .then(async (profile) => {
                this.data = profile
                console.log(`Response profiled.`, profile)
                return Promise.resolve(this.data)
            })
            .catch((e) => {console.error(e)})
    }

    async sendEmail() {
        return await mailer.send(this.data)
    }
}

module.exports = Report