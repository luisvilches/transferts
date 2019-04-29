Array.prototype.sync = function(callback,callbacktermino){
    var index = 0;
    var fin = this.length;
    var self = this;
    function recursiva(){
        if(index == fin){return callbacktermino();}
        if(index < fin){callback(self[index],index);index++;recursiva();}
    }
    recursiva();
  };

  const fs = require('fs');
  const path = require('path');
  const fileupload = require('../utils/fileupload');
  const FileModel = require('../models/files');
  const shortid = require('shortid');
  const cron = require('node-cron');
  const moment = require('moment');
  const NodeMailer = require('nodemailer');
  const smtpTransport = require('nodemailer-smtp-transport');

  exports.upload = (req,res) => {
    var d = new Date();
    var folder = 'trfst_'+ d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds() + getRandomInt(0,10000);
    var dir = path.join(path.resolve(),'public','files',folder);
    var files = req.files.files;
    var data = req.body;
    var dateRemove;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir,0744);
    }
    
    if(Array.isArray(files)){
        files.sync(e =>{ 
            fileupload(e,e.name,folder);
        }, () => compress(path => {generateUrlDownload(path);}));
    } else {
        fileupload(files,files.name,folder);
        compress(path => {generateUrlDownload(path)});
    } 

    function compress(cb){
        var config = {
            dir:dir,
            dst:dir
        }

        if(data.password == '' || data.password == null || data.password == undefined){
            config.password = '';
        } else {
            config.password = data.password;
        }
        
        zipp(config).then((dst,e) => {
            cb(dst);
            deleteFolderRecursive(dir);

            var timeRemove;

            switch(data.times.toString()){
                case '0':
                    timeRemove = {num:1,type:'hours'}
                    break;
                case '1':
                    timeRemove = {num:1,type:'days'}
                    break;
                case '2':
                    timeRemove = {num:3,type:'days'}
                    break;
            }
            dateRemove = moment().add(timeRemove.num,timeRemove.type);
            var cronString = dateRemove.minute() +' '+ dateRemove.hour() +' '+ dateRemove.date() +' '+ (dateRemove.month() + 1) +' *';

            cron.schedule(cronString, () => {
                removeFile(dir+'.zip');
            });
        })
    }

    function generateUrlDownload(name){

        let code = shortid.generate();
        let file = new FileModel({
            name: folder + '.zip',
            dir: name + '.zip',
            url: getFormattedUrl(req) + '/' + code,
            code: code,
            message: data.message,
            user: data.name,
            pass: data.password
        });

        file.save((err,response) => {
            if (err) throw err;
            
            if(data.type.toString() === '1'){
                res.status(200).json({success:true,data:response}); 
            } else {
                dateRemove.locale(false);
                sendMail(data.email,{
                    name:data.name,
                    message:data.message,
                    file:response.name,
                    url:'http://transferts.ml/'+response.code,
                    exp:dateRemove.format('DD-MM-YYYY, h:mm:ss a')
                })
                .then(e => {
                    res.status(200).json({success:true,data:response});
                })
            }
        })
    }
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function removeFile(path){
    fs.unlink(path, (err) => {
        if (err) {return console.error(err);}
        console.log('removed');
    })
}

function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

  function getFormattedUrl(req) {
    return req.protocol + '://' + req.get('host');
}


function zipp(opt){
    return new Promise((resolve,reject) => {
        var spawn = require('child_process').spawn;
        var isPassword = opt.password === '' || null ? [opt.dst +'.zip','-rj', opt.dir]:['-P', opt.password , opt.dst +'.zip','-rj', opt.dir];
        var zipp = spawn('zip',isPassword);
        zipp.on('exit', function(code) {
            resolve(opt.dst,code);
        });
    })
}

function sendMail(mails,options,url){
    return new Promise((resolve,reject) => {
        let mailOptions = {
            from: 'lvilches21@gmail.com',
            to: mails,
            subject: 'Transferts',
            html: fs.readFileSync(path.join(path.resolve(),'views','templateEmail.html'), 'utf-8').replace(/\{\{\s?(\w+)\s?\}\}/g, (match, variable) => {
                return options[variable] || ''
            })
        };
    
        let transporter = NodeMailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'lvilches21@gmail.com',
                pass: 'andres3190'
            }
        }));
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error){
                reject(error);
            } else {
                resolve(true);
            }
        })
    })
}