const Model = require('../models');
const randomColor = require('../utils/randomColor');
const uploadfile = require('../utils/fileupload');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



exports.createUser = (req,res) => {
    let user = new Model.User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role.toLowerCase(),
        avatar: 'https://ui-avatars.com/api/?size=1024&background='+randomColor()+'&color=fff&name='+req.body.name.charAt(0)+'+'+req.body.name.charAt(1)
    });

    user.save((err,user) => {
        if(err) throw (res.json({success:false}));
        console.log("register =>",user);
        res.json({success:true,data:user})
    });
};

exports.user = (req,res) => {
    Model.User.findById({_id:req.params.id}, (err,response) => {
        if(err) throw (res.json({success: false}));
        res.status(200).json(response);
    })
};

exports.userAll = (req,res) => {
    Model.User.find({},(err,response) => {
        if(err) throw (res.json({success: false}));
        res.status(200).json(response);
    });
} ;


exports.updateInfoProfile = (req,res) => {
    console.log(typeof req.body.skills , '=>', req.body.skills);
    var tags = req.body.skills.split(',');
    Model.User.findOneAndUpdate({ _id: req.params.id }, { $set: {
            name: req.body.name,
            username: req.body.username.replaceAll(' ','-').toLowerCase(),
            location: req.body.location,
            description: req.body.description,
            socials:{
                facebook:req.body.facebook,
                twitter:req.body.twitter,
                linkedin:req.body.linkedin,
                other:req.body.other
            },
            skills:tags,
            job:req.body.job
        } }, { new: true }, (err, response) => {
        if(err) throw res.status(500).json({success:false});
        res.status(200).json({success:true,data:response});
    });
};

exports.setPassword = (req,res) => {
    Model.User.findOneAndUpdate({ _id: req.params.id }, { $set: {
            password: req.body.password,
        } }, { new: true }, (err, response) => {
        if(err) throw res.status(500).json({success:false});
        res.status(200).json({success:true,data:response});
    });
};

exports.setAvatar = (req,res) => {
    var host;
    if( req.hostname === 'localhost'){
        host = 'http://localhost:1989';
    } else {
        host = 'http://'+req.hostname;
    }
    Model.User.findOneAndUpdate({ _id: req.params.id }, { $set: {
            avatar: host + '/' + uploadfile(req.files.avatar,'avatar_'),
        } }, { new: true }, (err, response) => {
        if(err) throw res.status(500).json({success:false});
        res.status(200).json({success:true,data:response});
    });
};

exports.addSkills = (req,res) => {
    /*Model.User.findOneAndUpdate({_id: req.params.id}, {$push: {skills: req.body.skills}},(err,response) => {
        if(err) throw res.status(500).json({success:false});
        res.status(200).json({success:true,data:response});
    });*/
    console.log(req.body.skills)
};