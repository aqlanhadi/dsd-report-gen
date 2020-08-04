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
    'RM2,001 - RM4,000': 4000,
    'RM4,001 - RM6,000': 6000,
    'RM6,001 - RM8,000': 8000,
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

const QIDS = {
    'loan': 'rGuxY2m9lKzk',
    'loan_list': 'pSmsF7MPrfOT',
    'service_pct': 'NlXHIFWaN8xY',
    'state': 'MMBD8ew3CQUR',
    'district': 'vn1nuUXmieat'
}

 /**
  * ======================================================================
  */

module.exports.extractor = async (response) => {

    var res = {
        name: response.hidden.name || '',
        email: response.answers.slice(-1)[0].email || 'fallbackemail@halduit.com',
        scores: {
            "groceries": parseScore('groceries', parseInt(response.hidden.gr)) || 0,
            "transport": parseScore('transport', parseInt(response.hidden.tr)) || 0,
            "eatingOut": parseScore('eatingOut', parseInt(response.hidden.eo)) || 0,
            "lifestyle": parseScore('lifestyle', parseInt(response.hidden.hl)) || 0
        },
        spentOn:{ //Optionals -- if 0, the respondents have decided to skip
            "groceries": parseInt(response.hidden.grt) || 0,
            "transport": parseInt(parseTransport(response.hidden.trt)) || 0,
            "eatingOut": parseInt(response.hidden.eot) || 0,
            "hobbies": parseInt(response.hidden.ht) || 0,
            "lifestyle": parseInt(response.hidden.lt) || 0
        },
        income: {
            "savePercentage": SAVE_PCT[response.answers[0].choice.label] || 0,      //* How much of your income do you save?
            "purchasePower": response.answers[1].choice.label || 0,                 //* Can you afford an unexpected expense of RM 1000
            "amount": INCOME_DEF[response.answers[3].choice.label] || 1             //* Income range
        },
        breakdown: null,
        debt: {
            "loan_status": null,                   
            "loan_list": null,    
            "service_pct": -1,      // by default it set to not answered
            "amount": null,
        },
        excess: {
            amount: null
        },
        savings: {
            amount: null
        },
        demographics: {
            "age": response.answers[2].choice.label || 0,                           //*
            "employment_status": response.answers[4].choice.label || 0,             //* Employment status
            "education_level": response.answers[5].choice.label || 0,               //*
            "state": null,                         
            "district": null,                    
        }
    }

    response.answers.forEach(answer => {
        if (answer.field.id === QIDS['loan']) res.debt.loan_status = answer.choice.label
        if (answer.field.id === QIDS['loan_list']) res.debt.loan_list = answer.choices.labels
        if (answer.field.id === QIDS['service_pct']) res.debt.service_pct = SERVICE_PCT[answer.choice.label]
        if (answer.field.id === QIDS['state']) res.demographics.state = answer.choice.label
        if (answer.field.id === QIDS['district']) res.demographics.district = answer.choice.label
    })

    return Promise.resolve(res)
}

module.exports.calculateItemsFrom = async res => {
    var breakdown = calcBreakdown(res)
    res.breakdown = breakdown
    res.debt.amount = res.debt.service_pct * res.income.amount
    res.excess.amount = (res.breakdown.excess * res.income.amount) / 100
    res.savings.amount = (res.breakdown.savings * res.income.amount) / 100
    return Promise.resolve(res)
}

function calcBreakdown(data) {
    console.log('Calculating Breakdowns')
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

// Fallbacks
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
        else return 0
    }
}

function percent(percent, num){
    return (percent / num) * 100;
}