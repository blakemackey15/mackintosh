"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = express_1["default"]();
var port = 3000;
var bodyParser = require('body-parser');
app.use(express_1["default"].static('public'));
app.use(bodyParser.json({ type: 'application/json' }));
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: './views' });
});
app.listen(port, function () {
    return console.log("server is listening on " + port);
});
