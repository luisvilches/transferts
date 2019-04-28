const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

let User = new Schema({
    name:{type:String,required:true},
    username:{type:String},
    skills:[
        {type:String}
    ],
    email:{type:String,required:true},
    password:{type:String,required:true},
    avatar:{type:String},
    role:{type:String,default:'user'},
    lastName:{type:String,default:''},
    fullname:{type:String,default:''},
    description:{type:String,default:''},
    location:{type:String,default:''},
    socials:{
        facebook:{type:String,default:''},
        twitter:{type:String,default:''},
        linkedin:{type:String,default:''},
        other:{type:String,default:''}
    },
    job:{type:String,default:'' }

});

User.plugin(timestamps,  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
module.exports = mongoose.model("User",User);