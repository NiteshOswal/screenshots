const connect = require('connect');
const url = require('url');
const qs = require('qs');

const app = connect();

app.use(function query(req, res, next) {
    console.log(url.parse(req.url));
    next();
});

app.use('/', function(req, res) {
    res.end(JSON.stringify(req.query));
});

http.createServer(app).listen(4000);