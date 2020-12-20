const mongoose = require("mongoose");

const guidesSchema = new mongoose.Schema({
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

}); 

module.exports = mongoose.model("Guides", guidesSchema);
