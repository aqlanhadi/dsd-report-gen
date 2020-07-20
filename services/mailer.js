const Email = require('email-templates')

module.exports.send = (data) => {
    console.log(data)
    const email = new Email({
        message: {
            from: 'hi@test.com'
        },
        send: false,
        open: true,
        transport: {
            host: 'smtp.mailtrap.io',
            port: 2525,
            ssl: false,
            tls: true,
            auth: {
                user: '46be50762b5c5f',
                pass: '2e7d93f73e0aad'
            }
        }
        
    })

    email.send({
        template: 'report',
        message: {
            to: data.email
        },
        locals: data
    })
    .catch(console.error)
}