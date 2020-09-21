const { users } = require('../db/db');
const { userSchema } = require('../schemas/schemas');
const { nanoid } = require('nanoid');
const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	async create(req, res) {
		let { name, email, password } = req.body;
		let uid = nanoid(10).toLowerCase();

		try {
			await userSchema.validate({
				uid,
				name,
				email,
				password,
			});

			let userPass = bcrypt.hashSync(password, 5);

			const newUser = {
				uid,
				name,
				email,
				password: userPass,
				tokens: [],
			};
			const created = await users.insert(newUser);
			res.json(created);
		} catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	},
	async login(req, res) {
		const { email, password } = req.body;
		const user = await users.findOne({ email });
		if (!user) {
			//throw new Error({ error: 'Invalid Login Email' });
			res.status(500).json({
				error: 'Usuário não encontrado',
			});
			return;
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			res.status(500).json({
				error: 'Senha inválida',
			});
			return;
		}
		try {
			const genToken = jwt.sign({ email: user.email }, process.env.JWT_KEY);
			await users.findOneAndUpdate({ email }, { $push: { tokens: genToken } });
			res.json({ msg: 'Token criado com Sucesso. Usuário autenticado.' });
		} catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	},
	async logout(req, res) {
		try {
			let validTokens = req.user.tokens.filter((token) => {
				return token != req.token;
			});
			let { email } = req.body;
			await users.findOneAndUpdate({ email }, { $set: { tokens: validTokens } });
			res.status(200).json({
				uid: req.user.uid,
				name: req.user.name,
				email: req.user.email,
				msg: 'Token invalidado e usuário deslogado com sucesso',
			});
		} catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	},
	async logoutAll(req, res) {
		try {
			let { email } = req.body;
			await users.findOneAndUpdate({ email }, { $set: { tokens: [] } });
			res.status(200).json({
				uid: req.user.uid,
				name: req.user.name,
				email: req.user.email,
				msg: 'Todos os tokens invalidados e usuário deslogado de todas as sessões',
			});
		} catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	},
	deleteUser(req, res) {
		const masterPass = req.header('Authorization').replace('Bearer ', '');
		if (!masterPass || masterPass != process.env.JWT_KEY) {
			res.status(403).json({
				error: 'Você não está autorizado a deletar usuários',
			});
			return;
		}
		const { email } = req.body;
		users.findOne({ email: email }).then((us) => {
			if (!us) {
				res.status(500).json({
					error: 'User not Found',
				});
				return;
			}
			users.remove(us);
			res.status(200).json({
				msg: 'Usuário apagado com sucesso',
			});
		});
	},
};
