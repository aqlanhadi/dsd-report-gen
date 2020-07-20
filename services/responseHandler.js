const Report = require('./Report')

module.exports.handle = async (response) => {
    const report = new Report()

    report.initialize(response)
        .then(async () => {
            return await report.sendEmail()
        })

    return 0
}