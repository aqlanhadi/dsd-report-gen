/**
 * ===================================================================== *
 *                              DEFINITIONS                              *
 * ===================================================================== *
 */

const PROFILE_DEFINITION = require('../models/profiles.json')
const { response } = require('express')
const INCOME_DEF = {
    'RM2,000 or less': 2000,
    'RM2,001-RM4,000': 4000,
    'RM4,001-RM6,000': 6000,
    'RM6,001-RM8,000': 8000,
    'More than RM8,000': 10000,
    'I prefer not to answer': -1
}

/**
 * ======================================================================
 */

module.exports.profile = async (data) => {
    console.log('Profiler received data')

    var res = {
        profile: 0,
        debtIncomeRatio: {}
    }

    res.profile = PROFILE_DEFINITION[profiler(data.scores)-1]
    res.debtIncomeRatio = getDIR(data.debt.service_pct)
    
    return Promise.resolve(Object.assign({}, data, res))
}

function profiler(scores) {
    var count = {'1': 0, '2': 0, '3': 0}
    //  Count min, med and max occurences
    Object.keys(scores).forEach((score, i) => {
        count[score] = (count[score] || 0) + 1;
    })

    //  Set default profile to highest
    var profile = 4

    //  !!! This is where the profile gets decided. Change definitions here.

    if(count[1] >= 3) { // if there are more than 3 categories in minimum: LEVEL 1 PROFILE
        //console.log("saver")
        profile = 1
    } else if (scores.transport === 1 && scores.eatingOut === 1) { //if transport and eating out is minimum -> LEVEL 2 PROFILE
        //console.log("shopper")
        profile = 2
    } else if (count[1] === 2) { // if there's only 2 categories in minimum: LEVEL 3 PROFILE
        //console.log("big spenders")
        profile = 3
    } else if (count[1] === 1) { // if there's only 1 categories in minimum: LEVEL 4 PROFILE
        //console.log("debtors")
        profile = 4
    }
    return profile
}

function getDIR(loan) {
    var loanpc = loan
    var debtRatio = 0
    var incomeRatio = 0
    var health = 'Not specified'
    var answered = false
    if(loanpc != -1) {
        answered = true
        var debtRatio = loanpc * 100
        var incomeRatio = 100 - debtRatio
        if (debtRatio < 30 ) health = 'Healthy'
        else if (debtRatio < 50) health = 'At Risk'
        else if (debtRatio < 100) health = 'Very Risky'
        return {
            answered,
            health,
            debtRatio,
            incomeRatio,
        }
    } else {
        return { answered }
    }
}