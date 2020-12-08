const mongoose = require("mongoose");

const guidesSchema = new mongoose.Schema({
  
  _id: {
    type: String,
  },
  
  title: {
    type: String,
  },
  
  assignment: {
    type: String,
  },
  
  project: {
    type: Object,    
  },
  
  category: {
    type: String,
  },
}); 

module.exports = mongoose.model("Guides", guidesSchema, "guides");
