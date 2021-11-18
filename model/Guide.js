const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  _id: {
    type: String,
},

Category: {
    type: String,
},

references: {
    type: Array,
},

Assignment: 
{
    type: String,
},

UID: {
    type: String,
},

Title: {
    type: String,
},

Description: {
    type: String,        
},

Knowledge: {
    type: Array,
},

Skills: {
    type: Array,
},

actionPoints:{
    type: Array,
},

Resources:{
    type: Array,
},

Topics:{
    type: Array,
},

Deliver:{
    type: Object,
},

topicsList:{
    type: String,
},

project:{
    type: Object,
},

Classes:{
    type: Array,
},
// the order of guides in each module
order:{
    type: Number,
},
//should students be able to see the guide?
hidden:{
    type: Boolean,
}

}); 

module.exports = mongoose.model("Guide", guideSchema);
