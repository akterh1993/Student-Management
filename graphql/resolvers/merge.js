const DataLoader = require('dataloader');

const Subject = require('../../models/subject');
const Student = require('../../models/student');
const { dateToString } = require('../../helpers/date');

const subjectLoader = new DataLoader((subjectIds) => {
  return subjects(subjectIds);
});

const studentLoader = new DataLoader(studentIds => {
  return Student.find({_id: {$in: studentIds}});
});

const subjects = async subjectIds => {
  try {
    const subjects = await Subject.find({ _id: { $in: subjectIds } });
    return subjects.map(subject => {
      return transformSubject(subject);
    });
  } catch (err) {
    throw err;
  }
};

const singleSubject = async subjectId => {
  try {
    const subject = await subjectLoader.load(subjectId.toString());
    return subject;
  } catch (err) {
    throw err;
  }
};

const student = async studentId => {
  try {
    const student = await studentLoader.load(studentId.toString());
    return {
      ...student._doc,
      _id: student.id,
      createdSubjects: () => subjectLoader.loadMany(student._doc.createdSubjects)
    };
  } catch (err) {
    throw err;
  }
};

const transformSubject = subject => {
  return {
    ...subject._doc,
    _id: subject.id,
    creator: student.bind(this, subject.creator)
  };
};

const transformAssign = assign => {
  return {
    ...assign._doc,
    _id: assign.id,
    student: student.bind(this, assign._doc.student),
    subject: singleSubject.bind(this, assign._doc.subject),
    createdAt: dateToString(assign._doc.createdAt),
    updatedAt: dateToString(assign._doc.updatedAt)
  };
};

exports.transformSubject = transformSubject;
exports.transformAssign = transformAssign;

// exports.student = student;
// exports.subjects = subjects;
// exports.singleEvent = singleEvent;
