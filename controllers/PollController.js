const { polls } = require('../db/db');
const { pollSchema } = require('../schemas/schemas');
const { nanoid } = require('nanoid');
const slugify = require('slugify');

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
				option.votes = 0;
			});
			try {
				pollSchema.validate({
					pid,
					name,
					slug,
					created: Date.now(),
					createdBy: req.user.uid,
					userCanType,
					totalVotes: 0,
					isOpen: true,
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
					isOpen: true,
					options,
				};

				polls.insert(newPoll);

				res.status(201).json({
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
	async vote(req, res) {
		const { pid, optionid } = req.params;

		if (optionid != 'other') {
			try {
				const pollToVote = await polls.findOne({
					$and: [{ pid: pid }, { options: { $elemMatch: { id: optionid } } }],
				});
				if (!pollToVote)
					return res.status(404).json({
						error: 'Enquete não encontrada',
					});
				if (!pollToVote.isOpen)
					return res.status(403).json({
						error: 'Esta enquete está fechada',
					});
				let addVoteToPoll = pollToVote.totalVotes + 1;
				let optionToVote = pollToVote.options.filter((option) => {
					return option.id === optionid;
				});
				let addVoteToOption = optionToVote[0].votes + 1;

				await polls.findOneAndUpdate(
					{ pid: pid },
					{
						$set: {
							totalVotes: addVoteToPoll,
						},
					}
				);

				await polls.update({ options: { $elemMatch: { id: optionid } } }, { $set: { 'options.$.votes': addVoteToOption } }, { arrayFilter: [{ 'option.id': optionid }], multi: true });

				const voted = await polls.findOne({ pid: pid });

				res.status(200).json({
					msg: 'Voto computado com sucesso',
					voted,
				});
			} catch (error) {
				console.log(error);
				res.status(500).json(error);
			}
		} else {
			const { customVote } = req.body;
			if (!customVote)
				return res.status(500).json({
					error: 'Você não pode votar em branco.',
				});
			try {
				const pollToVote = await polls.findOne({ pid: pid });
				if (!pollToVote.isOpen)
					return res.status(403).json({
						error: 'Esta enquete está fechada',
					});
				if (!pollToVote.userCanType)
					return res.status(500).json({
						error: 'Você não pode emitir uma opinião diferente nesta enquete.',
					});
				if (!pollToVote.customVotes) {
					await polls.findOneAndUpdate(
						{ pid: pid },
						{
							$set: {
								customVotes: [customVote], // cria o campo com o primeiro valor dentro de um Array
							},
						}
					);
				} else {
					let newCustomVotes = pollToVote.customVotes;
					newCustomVotes.push(customVote);
					await polls.findOneAndUpdate(
						{ pid: pid },
						{
							$set: {
								customVotes: newCustomVotes,
							},
						}
					);
				}
				const voted = await polls.findOne({ pid: pid });

				res.status(200).json({
					msg: 'Voto computado com sucesso',
					voted,
				});
			} catch (error) {
				console.log(error);
				res.status(500).json(error);
			}
		}
	},
	async edit(req, res) {
		const { pid } = req.params;
		try {
			const pollToEdit = await polls.findOne({ pid: pid });
			console.log(pollToEdit);
			if (pollToEdit.totalVotes != 0)
				return res.status(403).json({
					error: 'Você não pode editar uma enquete que já possui votos computados.',
				});
			const edited = await polls.findOneAndUpdate({ pid: pid }, { $set: req.body });
			res.status(203).json({
				msg: 'Enquete editada com sucesso',
				edited,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	},
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
