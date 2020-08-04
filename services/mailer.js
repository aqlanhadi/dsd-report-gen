const Email = require('email-templates')

module.exports.send = async (data) => {
    console.log('Processed Data: ',JSON.stringify(data))

    const email = new Email({
        message: {
            from: `HalDuit <${process.env.MAIL_USER}>`,
        },
        send: true,
        transport: {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            ssl: false,
            tls: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }
        
    })

    return await email.send({
        template: 'report-v2',
        message: {
            to: data.email
        },
        locals: data
    })
    .then((log) => {
        console.log(`Status: `, log.response)
        if (log.accepted.length > 0) console.log(`Accepted: `,log.accepted)
        if (log.rejected.length > 0) console.log(`Rejected: `,log.rejected)
    })
    .catch(console.error)
}