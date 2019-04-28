const router = require('express').Router();
const body = require('connect-multiparty')();
const ctrl = require('../controllers');
const FileModel = require('../models/files');

router.post('/login', body, ctrl.auth.auth);

router.post('/register',body, ctrl.users.createUser);

router.get("/", function(req,res){
    res.response('index', {img:randomImg(),bool:true});
});

router.get('/:id', function(req,res){
    FileModel.findOne({code:req.params.id},(err,response) => {
        var page = {img:randomImg(), data:response}
        console.log('<>',response)
        if(err){
            
        } else{
            if(response == null){
                res.response('404',{img:page.img});
            } else {
                res.response('file', page);
            }
        }
    })
})


module.exports = router;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomImg(){
    return '/imagenes/' + getRandomInt(1, 5) + '.jpg';
}