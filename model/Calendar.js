const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
    _id: {
        type: String,
    },

    Category: {
        type: String, //what kind of event is this (is it a guide, trip, meeting etc...?)
    },

    Attending: {
        type: Array, //array of objectIds - only registered users can attend the events
    },

    Title: 
    {
        type: String, //name of the event
    },

    Owner: {
        type: String, //who created this event
    },

    Description: {
        type: String, //description of the event
    },


    Starting: {
        type: Date, //when does the event start
    },

    Ending: {
        type: Date, //when does the event end
    },

    updatedAt:{
        type: Date,
    },
}); 

module.exports = mongoose.model("Calendar", calendarSchema);
