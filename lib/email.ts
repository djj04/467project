import * as nodemailer from 'nodemailer'

export async function sendEmail(subject: string, body: string, address: string) {
	if (!process.env.EMAIL_SMTP_HOST) {
		console.log(`Should send email with subject ${subject} to ${address}`, body)
		return
	}
	let transporter = nodemailer.createTransport({
		host: process.env.EMAIL_SMTP_HOST,
		port: process.env.EMAIL_SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.EMAIL_SMTP_USER,
			pass: process.env.EMAIL_SMTP_PASS
		},
		tls: {
			rejectUnauthorized: false
		}
	})

	console.log(await transporter.sendMail({
		from: process.env.EMAIL_SENDER,
		to: address,
		subject: subject,
		text: body
	}))
}