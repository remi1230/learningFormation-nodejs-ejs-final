const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail(options = {
    from    : 'remitafforeau@gmail.com',
    to      : 'remitafforeau@yahoo.fr',
    subject : 'Author wrote no sujet',
    text    : 'Author wrote no text'
})
{
    // Créer un transporteur SMTP utilisant SES
    let transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com", // Remplacez par l'URL SMTP de votre région SES
    port: 587,
    secure: false, // true pour 465, false pour tout autre port
    auth: {
        user: process.env.SES_SMTP_USER,
        pass: process.env.SES_SMTP_PASSWORD 
    }
    });

    // Envoi de l'email
    transporter.sendMail(options, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    });
}


module.exports = { sendMail };