const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    orignal_url:{
        type: String,
        required: true
    },
    short_url:{
        type:String,
        required:true,
        unique:true
    }
});
// Create model usng the schema
const Url = mongoose.model('URL',urlSchema);
module.exports = Url;