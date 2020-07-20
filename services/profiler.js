module.exports.profile = (data) => {
    console.log('Profiler received data')
    
    return Promise.resolve({
        profile: '',
        debtIncomeRatio: {
            debtRatio: 0,
            incomeRatio: 0,
            health: 0
        }
    })
}