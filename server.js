const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist'));

app.get('*', (req, res) => {
	console.info(req.path);
	res.sendFile(__dirname + '/dist/index.html');
});

app.listen(PORT, function () {
	console.log(`App listening on port ${PORT}, __dirname=${__dirname}!`);
});
