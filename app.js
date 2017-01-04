const connect = require('connect');
const url = require('url');
const qs = require('qs');
const http = require('http');


const app = connect();

app.use((req, res, next) => {
    var _query = url.parse(req.url).query;
    req.query = _query ? qs.parse(_query, {allowDots: true, plainObjects: true}) : {};
    next();
});

app.use('/', (req, res) => {
    res.end(JSON.stringify(req.query));
});

http.createServer(app).listen(4000);