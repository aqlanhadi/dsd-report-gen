const Email = require('email-templates')

module.exports.send = async (data) => {
    console.log(data)
    const email = new Email({
        message: {
            from: 'hi@test.com'
        },
        send: true,
        transport: {
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            ssl: false,
            tls: true,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        }
        
    })

    return await email.send({
        template: 'report',
        message: {
            to: data.email
        },
        locals: data
    })
    .then((log) => {
        console.log(`Status => `, log.response)
    })
    .catch(console.error)
}