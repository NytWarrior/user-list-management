import nodemailer from 'nodemailer';
import List from '../models/list.model.js';
import dotenv from 'dotenv';
dotenv.config();


export const sendEmail = async (req, res) => {
    const { listId } = req.params;
    const { subject } = req.body;
    const list = await List.findById(listId);

    if (!list) {
        return res.status(404).json({ error: 'List not found' });
    }

    const users = list.users.filter(user => !user.unsubscribed);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    for (const user of users) {
        let emailBody = `Hey ${user.name}!\n\n` +
            `Thank you for signing up with your email ${user.email}. We have received your city as ${user.properties.get('city')}.\n\nSome of other details are:\n`;

        // Append custom properties to the email body
        user.properties.forEach((value, key) => {
            if (!key.startsWith('__$')) {
                emailBody += `${key}: ${value}\n`;
            }
        });

        emailBody += `\nTeam MathonGo.`;

        await transporter.sendMail({
            from: process.env.GMAIL,
            to: user.email,
            subject,
            text: emailBody
        });
    }

    res.json({ message: 'Emails sent' });
}

