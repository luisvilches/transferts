'use estric'
const express = require('express');
const config = require('./settings');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes/public');
const routesPrivates = require('./routes/private');
const api = require('./routes/api');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const auth = require('./middlewares/auth');
const body = require('connect-multiparty')();
mongoose.Promise = global.Promise;

app.engine('html', require('./engine')());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(morgan('combined'));
app.use(express.static(path.join(path.resolve(),'public')));
app.use(function(req,res,next){
    res['response'] = function(file,data){
        res.setHeader('Set-Cookie', setCookie('_simplicity',JSON.stringify(data)));
        res.render(file,data);
    }
    next();
});

app.use("/api",body,api);
app.use("/",body,routes);
app.use("/auth",auth.auth,body,routesPrivates);


app.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
        res.response('404',{img:randomImg()});
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

mongoose.connect(utils.db.connectionString()).then(() => {
        console.log('connect database server');
    }).catch(err => {
        console.log(err);
    });


app.listen(config.SERVER.port, err => {
    if(err) throw err;
    console.log('server running in port', config.SERVER.port);
});


function setCookie(cname, cvalue) {
    return String(cname + "=" + cvalue + ";" + ";path=/");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomImg(){
    return '/imagenes/' + getRandomInt(1, 5) + '.jpg';
}