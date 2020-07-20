var utility = require('./utility')
var profiler = require('./profiler')

class Report {

    data = {}

    constructor(body) {
        console.log(`Profiler invoked.`)
        this.data = utility.extractor(body)
            .then(async (extractedData) => {
                profiler.profile(extractedData)
            })
    }
}

module.exports = Report