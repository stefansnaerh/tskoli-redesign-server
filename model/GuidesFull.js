const mongoose = require("mongoose");

const guidesFullSchema = new mongoose.Schema({
    // add schema data type
    _id: {
        type: String,
    },

    Category: {
        type: String,
    },

    references: {
        type: Array,
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

    /*Deliverable: {
        type: String,       
    }, */

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

module.exports = mongoose.model("GuidesFull", guidesFullSchema, "guidesFull");// the last one is the collection name
