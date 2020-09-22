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
	async deletePoll(req, res) {
		const { pid } = req.params;
		if (!pid) return res.status(500).json({ error: 'É necessário informar o Poll ID (pid) ao fazer a requisição' });
		const user = req.user;
		try {
			const found = await polls.findOne({ pid: pid });
			if (!found) return res.status(404).json({ error: 'Enquete não encontrada' });
			if (found.createdBy === user.uid) {
				await polls.remove(found);
				res.status(200).json({
					msg: 'Enquete apagada com sucesso',
					found,
				});
			} else {
				res.status(403).json({
					msg: 'Você não pode apagar enquetes de outros usuários',
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	},
	async pollsByUser(req, res) {
		const user = req.user;
		try {
			const results = await polls.find({ createdBy: user.uid });
			res.status(200).json(results);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	},
	async pollById(req, res) {
		const { pid } = req.params;
		if (!pid) return res.status(500).json({ error: 'É necessário informar o Poll ID (pid) ao fazer a requisição' });
		try {
			const found = await polls.findOne({ pid: pid });
			if (!found) return res.status(404).json({ error: 'Enquete não encontrada' });
			res.status(200).json(found);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	},
};
