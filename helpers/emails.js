import nodemailer from 'nodemailer';

const emailRegister = async (data) => {
	const { name, email, token } = data;

	const transport = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: '4b9efa5d82ebd7',
			pass: '448f0bd45411f2',
		},
	});

	// Information Email

	const info = await transport.sendMail({
		from: '"Thullo-Trello" <thullotrello@correo.com>',
		to: email,
		subject: '"Thullo-Trello" - Compruebe su cuenta',
		text: 'Comprueba tu cuenta',
		html: `
      <p>Hola: ${name} Comprueba tu cuenta</p>
      
      <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlance</p> 
      
      <a href="${process.env.FRONTEND_URL}/auth/confirm/${token}">Comprobar Cuenta</a>

      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
	});
};

const emailForgetPassword = async (data) => {
	const { name, email, token } = data;

	const transport = nodemailer.createTransport({
		host: 'smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: '4b9efa5d82ebd7',
			pass: '448f0bd45411f2',
		},
	});

	// Information Email

	const info = await transport.sendMail({
		from: '"Thullo-Trello" <thullotrello@correo.com>',
		to: email,
		subject: '"Thullo-Trello" - Establece tu password',
		text: 'Establece tu password',
		html: `
      <p>Hola: ${name} Haz solicitado reestablecer tu password</p>
      
      <p>Sigue el siguiente enlace para generar tu nuevo password</p> 
      
      <a href="${process.env.FRONTEND_URL}/auth/forget-password/${token}">Reestablece tu password </a>

      <p>Si tu no solicitaste este email, ponte en contacto con soporte</p>
      `,
	});
};

export { emailRegister, emailForgetPassword };
