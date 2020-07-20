const utility = require('./utility')
const profiler = require('./profiler')
const mailer = require('./mailer')

class Report {

    data = {}

    constructor() {
        console.log(`Profiler invoked.`)
    }

    async initialize(body) {
        return await utility.extractor(body)
            .then(async (extractedData) => {
                return await profiler.profile(extractedData)
            }).then(async (profile) => {
                this.data = profile
                return Promise.resolve(this.data)
            }).catch((e) => {console.error(e)})
    }

    async sendEmail() {
        return Promise.resolve(mailer.send(this.data))
    }
}

module.exports = Report