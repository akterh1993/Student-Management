const Subject = require('../../models/subject');
const Student = require('../../models/student');

const { transformSubject } = require('./merge');

module.exports = {
  subjects: async () => {
    try {
      const subjects = await Subject.find();
      return subjects.map(subject => {
        return transformSubject(subject);
      });
    } catch (err) {
      throw err;
    }
  },
  createSubject: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const subject = new Subject({
        subject: args.subjectInput.subject,

      creator: req.subjectId
    });
    let createdSubject;
    try {
      const result = await subject.save();
      createdSubject = transformSubject(result);
      const creator = await Student.findById(req.studentId);

      if (!creator) {
        throw new Error('Student not found.');
      }
      creator.createdSubjects.push(subject);
      await creator.save();

      return createdSubject;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
