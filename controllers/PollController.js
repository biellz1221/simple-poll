const { polls } = require('../db/db');
const { pollSchema } = require('../schemas/schemas');
const { nanoid } = require('nanoid');
const slugify = require('slugify');
const jwt = require('jsonwebtoken');

module.exports = {
	create(req, res) {
		const { name, userCanType, options } = req.body;
		const authHeader = req.header('Authorization').replace('Bearer ', '');
		const pid = nanoid(10).toLowerCase();
		if (req.user.tokens.includes(authHeader)) {
			let slug = slugify(name, {
				lower: true,
				strict: true,
			});

			options.forEach((option) => {
				option.id = nanoid(10).toLowerCase();
				console.log(option);
			});
			console.log('idOpt', options);
			try {
				pollSchema.validate({
					pid,
					name,
					slug,
					created: Date.now(),
					createdBy: req.user.uid,
					userCanType,
					totalVotes: 0,
					options,
				});
				const newPoll = {
					pid,
					name,
					slug,
					created: Date.now(),
					createdBy: req.user.uid,
					userCanType,
					totalVotes: 0,
					options,
				};

				polls.insert(newPoll);

				res.status(200).json({
					msg: 'Enquete criada com sucesso',
					newPoll,
				});
			} catch (error) {
				console.log(error);
				res.status(500).json({
					error: error,
				});
			}
		} else {
			console.log('Token Inválido');
			res.status(403).json({
				error: 'Este token é inválido para este usuário',
			});
		}
	},
	async vote(req, res) {},
	async edit(req, res) {},
	async deletePoll(req, res) {},
	async pollsByUser(req, res) {},
	async pollById(req, res) {},
};
