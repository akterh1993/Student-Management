const Subject = require('../../models/subject');
const Assign = require('../../models/assign');
const { transformAssign, transformSubject } = require('./merge');

module.exports = {
    assigns: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const assigns = await Assign.find({student: req.studentId});
      return assigns.map(assign => {
        return transformAssign(assign);
      });
    } catch (err) {
      throw err;
    }
  },
  assignSubject: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const fetchedSubject = await Subject.findOne({ _id: args.subjectId });
    const assign = new Assign({
      student: req.studentId,
      subject: fetchedSubject
    });
    const result = await assign.save();
    return transformAssign(result);
  },
  cancelAssign: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const assign = await Assign.findById(args.assignId).populate('subject');
      const subject = transformSubject(assign.subject);
      await Assign.deleteOne({ _id: args.assignId });
      return subject;
    } catch (err) {
      throw err;
    }
  }
};
