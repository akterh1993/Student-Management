const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const registerSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject'
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assign', registerSchema);
