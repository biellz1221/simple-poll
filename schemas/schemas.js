const yup = require('yup');

const pollSchema = yup.object().shape({
	pid: yup
		.string()
		.trim()
		.matches(/[\w\-]/i)
		.required(),
	slug: yup
		.string()
		.trim()
		.matches(/[\w\-]/i)
		.required(),
	name: yup.string().required(),
	created: yup.date().required(),
	createdBy: yup.string().trim().required(),
	userCanType: yup.boolean(),
	totalVotes: yup.number().positive().integer(),
	options: yup.array().of(
		yup.object().shape({
			id: yup
				.string()
				.trim()
				.matches(/[\w\-]/i)
				.required(),
			text: yup.string().required(),
			votes: yup.number().integer().positive(),
			order: yup.number().integer().positive(),
		})
	),
});

const userSchema = yup.object().shape({
	uid: yup
		.string()
		.trim()
		.matches(/[\w\-]/i)
		.required(),
	name: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().trim().required(),
	tokens: yup.array().of(yup.string().trim()),
});

module.exports = { pollSchema, userSchema };
