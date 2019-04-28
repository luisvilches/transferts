const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

let File = new Schema({
    name:{type:String,required:true},
    url:{type:String,required:true},
    code:{type:String,required:true},
    message:{type:String,required:false},
    dir:{type:String,required:true},
    user:{type:String,required:false},
    pass:{type:String,required:false},
});

File.plugin(timestamps,  {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
module.exports = mongoose.model("File",File);