var mongoose = require('mongoose');

var gamestatSchema = new mongoose.Schema({
  name: String,
  score: Number,
  created_at: Date,
  updated_at: Date
});

//define a pre save hook function to save date
gamestatSchema.pre('save', function(next){  //every time an instance is saved
  var now = new Date(); //update the date field to now
  this.updated_at = now; //every time we update, set that field to now
  if(!this.created_at) {
    this.created_at = now;
  }
  next();
});

//registering our schema with mongoose/mongo
var Gamestat = mongoose.model('Gamestat', gamestatSchema);
module.exports = Gamestat;
