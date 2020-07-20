const Report = require('./Report')

module.exports.handle = (response) => {
    const report = new Report(response)
    return 0
}