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
    console.log(req.query.url);
    if(!req.query.url) {
        return send(req, defaultImagePath).pipe(res);
    }
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
                if(!err && req.query.force) {
                    fs.unlinkSync(imagePath);
                    err = true;
                }
                if(err) {
                    webshot(req.query.url, imagePath, {
                        windowSize: {
                            width: 512,
                            height: 384
                        },
                        timeout: 3000
                    }, (err) => {
                        if(err) {
                            callback(err, defaultImagePath)
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
        console.log("Final Response", err, result);
        send(req, result).pipe(res);
    });
});

http.createServer(app).listen(process.env.PORT || 4000);