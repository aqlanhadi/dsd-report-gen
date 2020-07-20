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

 /**
  * ======================================================================
  */


module.exports.extractor = async (response) => {
    return Promise.resolve({
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
            "savePercentage": response.answers[0].choice.label,
            "purchasePower": response.answers[1].choice.label,
            "income": response.answers[3].choice.label
        },
        debt: {
            "loan_status": response.answers[6].choice.label,
            "loan_list": 0,//if stat y/n response.answers[7].choices.labels,
            "service_pct": response.answers[8].choice.label,
        },
        demographics: {
            "age": response.answers[2].choice.label,
            "employment_status": response.answers[4].choice.label,
            "education_level": response.answers[5].choice.label,
            "state": response.answers[9].choice.label,
            "district": response.answers[10].choice.label
        }
    })
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