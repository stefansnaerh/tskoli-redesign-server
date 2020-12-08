const mongoose = require("mongoose");

// Define stage to add convertedId field with converted _id value

idConversionStage = {
    $addFields: {
       convertedId: { $toObjectId: "$_id" }
    }
 };
 
 // Define stage to sort documents by the converted qty values
 
 sortStage = {
    $sort: { "convertedId": -1 }
 };
 
 
 db.guidesFull.aggregate( [
    idConversionStage,
    sortStage
 ])