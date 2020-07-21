/**
 * ===================================================================== *
 *                              DEFINITIONS                              *
 * ===================================================================== *
 */

const TRANSPORT_RESPONSE = {
    "less than RM10": 10,
    "RM10-50": 50,
    "more than RM50": 100,
    "never calculated": 200
}

const INCOME_DEF = {
    'RM2,000 or less': 2000,
    'RM2,001-RM4,000': 4000,
    'RM4,001-RM6,000': 6000,
    'RM6,001-RM8,000': 8000,
    'More than RM8,000': 10000,
    'I prefer not to answer': -1
}

const SERVICE_PCT = {
    'Lower than 20%': .1,
    '20%-40%': .3,
    '20%-40%': .7,
    'I prefer not to answer': -1
}

const SAVE_PCT = {
    "I don't have enough to save": 0,
    "Quarter of my income": 0.25,
    "Half of my income": 0.5,
    "More than half of my income": 0.75,
    "I'm not sure": 0
}

 /**
  * ======================================================================
  */

module.exports.extractor = async (response) => {

    var res = {
        name: response.hidden.name,
        email: response.answers.slice(-1)[0].email,
        scores: {
            "groceries": parseScore('groceries', parseInt(response.hidden.gr)),
            "transport": parseScore('transport', parseInt(response.hidden.tr)),
            "eatingOut": parseScore('eatingOut', parseInt(response.hidden.eo)),
            "lifestyle": parseScore('lifestyle', parseInt(response.hidden.hl))
        },
        spentOn:{
            "groceries": parseInt(response.hidden.grt),
            "transport": parseInt(parseTransport(response.hidden.trt)),
            "eatingOut": parseInt(response.hidden.eot),
            "hobbies": parseInt(response.hidden.ht),
            "lifestyle": parseInt(response.hidden.lt)
        },
        income: {
            "savePercentage": SAVE_PCT[response.answers[0].choice.label],
            "purchasePower": response.answers[1].choice.label,
            "amount": INCOME_DEF[response.answers[3].choice.label]
        },
        breakdown: null,
        debt: {
            "loan_status": response.answers[6].choice.label,
            "loan_list": 0,//if stat y/n response.answers[7].choices.labels,
            "service_pct": SERVICE_PCT[response.answers[8].choice.label],
            "amount": null,
        },
        excess: {
            amount: null
        },
        savings: {
            amount: null
        },
        demographics: {
            "age": response.answers[2].choice.label,
            "employment_status": response.answers[4].choice.label,
            "education_level": response.answers[5].choice.label,
            "state": response.answers[9].choice.label,
            "district": response.answers[10].choice.label
        }
    }

    var breakdown = calcBreakdown(res)
    res.breakdown = breakdown
    res.debt.amount = SERVICE_PCT[response.answers[8].choice.label] * res.income.amount
    res.excess.amount = (res.breakdown.excess * res.income.amount) / 100
    res.savings.amount = (res.breakdown.savings * res.income.amount) / 100
    return Promise.resolve(res)
}

function calcBreakdown(data) {
    var income = data.income.amount
    var groceries = percent(data.spentOn.groceries, income)
    var transport = percent(data.spentOn.transport, income)
    var eatingOut = percent(data.spentOn.eatingOut, income)
    var lifestyle = percent(data.spentOn.lifestyle, income)
    var savings = data.income.savePercentage
    var debt = data.debt.service_pct
    var excess = 100 - 
        groceries - 
        transport -
        eatingOut -
        lifestyle -
        savings -
        debt
    var usage = 100 - excess

    return {
        groceries: round(groceries),
        transport: round(transport),
        eatingOut: round(eatingOut),
        lifestyle: round(lifestyle),
        debt: round(debt),
        savings: round(savings),
        usage: round(usage),
        excess: round(excess)
    }
}

function round(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100
}

function parseTransport(res) {
    return TRANSPORT_RESPONSE[res]
}

function parseScore(from, data) {
    switch(from) {
        case 'groceries':
            return score(3, 6, 10, 12, data)
        case 'transport':
            return score(2, 6, 11, 14, data)
        case 'eatingOut':
            return score(1, 4, 7, 9, data)
        case 'lifestyle':
            return score(2, 5, 8, 20, data)
        default:
            return 0
    }

    function score(low, med, high, highLimit, score) {
        if(score >= low && score < med) return 1
        if(score >= med && score < high) return 2
        if(score >= high && score <= highLimit) return 3
        else return `unknown (${score})`
    }
}

function percent(percent, num){
    return (percent / num) * 100;
}