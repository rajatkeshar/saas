const fs                = require('fs');
const cors              = require('cors');
const morgan            = require("morgan");
const helmet            = require('helmet');
const express           = require("express");
const passport          = require('passport');
const bodyParser        = require('body-parser');
const session           = require('express-session');
const auth              = require(global.appDir + "/middleware/auth");
const authMiddleware    = require(global.appDir + "/middleware/authMiddleware");
const app = express();

require('dotenv').config()

app.use(helmet());
app.disable("etag").disable('x-powered-by');
app.use(cors());

app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400; }
}));

// Initialize passport
app.use(session({ secret: 'secret', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	next();
});

app.get('/api/sync_time', function(req, res) {
    res.send([new Date().toISOString()]);
});

app.use("/api", authMiddleware());
app.use("/adminapi", authMiddleware());
app.use(bodyParser.json());

const adminFileLists =["Dashboard.rest.js"];

function init(path, app) {
    let rest = path + '/rest';
    let files = fs.readdirSync(rest);
    files.forEach(function(file){
        if(['.','..'].indexOf(file) > -1 || (process.env.APP !== "admin" && adminFileLists.indexOf(file)>-1)) {
            return;
        }
        let filePath = [rest,file].join('/');
        let pathStat = fs.statSync(filePath);
        if(pathStat.isFile() && file.substr(-3) === '.js') {
            require(filePath).init(app);
        }
    });
}

init(__dirname, app);

module.exports.start = function() {
    return app.listen(process.env.API_PORT || 5000, function(err) {
        if (err) {
            console.log('Error in starting api server:', err);
        }
        console.log("api server listening on",  process.env.API_PORT || 5000);
    });
};
