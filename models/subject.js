const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
  }
});

module.exports = mongoose.model('Subject', subjectSchema);
