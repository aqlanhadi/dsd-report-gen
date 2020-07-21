const Report = require('./Report')

module.exports.handle = async (response) => {
    const report = new Report()

    return await report.initialize(response)
        .then(async () => {
            return await report.sendEmail()
        })

}