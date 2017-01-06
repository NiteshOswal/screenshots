const connect = require('connect');
const url = require('url');
const qs = require('qs');
const http = require('http');
const path = require('path');
const send = require('send');
const fs = require('fs');
const md5 = require('md5');
const webshot = require('webshot');
const async = require('async');
const isUrl = require('is-url');

const defaultImagePath = path.join(__dirname, "cache", "default.png");

const app = connect();

app.use((req, res, next) => {
    var _query = url.parse(req.url).query;
    req.query = _query ? qs.parse(_query, {allowDots: true, plainObjects: true}) : {};
    next();
});

app.use('/', (req, res) => {
    const _id = md5(req.query.url);
    const imagePath = path.join(__dirname, "cache", _id + ".png");
    async.waterfall([
        (callback) => {
            if(!isUrl(req.query.url)) {
                callback(true, defaultImagePath);
            } else {
                callback(null);
            }
        },
        (callback) => {
            fs.stat(imagePath, (err, data) => {
                if(err) {
                    webshot(req.query.url, imagePath, (err) => {
                        if(err) {
                            callback(null, defaultImagePath)
                        } else {
                            callback(null, imagePath);
                        }
                    })
                } else {
                    callback(null, imagePath);
                }
            });
        }
    ], (err, result) => {
        send(req, result).pipe(res);
    });
});

http.createServer(app).listen(process.env.PORT || 4000);