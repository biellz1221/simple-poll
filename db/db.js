const monk = require('monk');
require('dotenv').config();

const db = monk(process.env.MONGODB_URI);

const polls = db.get('polls');
const users = db.get('users');

polls.createIndex({ slug: 1 }, { unique: true });
users.createIndex({ email: 1 }, { unique: true });

module.exports = { polls, users };
