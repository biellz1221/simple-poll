const { polls } = require('../db/db');
const { userSchema } = require('../schemas/schemas');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	async create(req, res) {},
	async vote(req, res) {},
	async edit(req, res) {},
	async deletePoll(req, res) {},
	async pollsByUser(req, res) {},
	async pollById(req, res) {},
};
