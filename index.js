const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./routes/routes');

const port = process.env.PORT || 1337;

const app = express();

app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use(router);

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
