import express from 'express';
import path from 'path';

const app = express();
const port = 3000;
var bodyParser = require('body-parser');
require('typescript-require');

app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ type: 'application/json' }));
app.get('/', (req, res) => {
  res.sendFile('index.html', {root: './src/views'});
});

app.listen(port, function () {
    return console.log("server is listening on " + port);
});