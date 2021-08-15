const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Student = require('../../models/student');

module.exports = {
  createStudent: async args => {
    try {
      const existingStudent = await Student.findOne({ email: args.studentInput.email });
      if (existingStudent) {
        throw new Error('Student exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.studentInput.password, 12);

      const student = new Student({
        name: args.studentInput.name,
        email: args.studentInput.email,
        phone: args.studentInput.phone,
        password: hashedPassword,
        date: args.studentInput.date
      });

      const result = await student.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const student = await Student.findOne({ email: email });
    if (!student) {
      throw new Error('Student does not exist!');
    }
    const isEqual = await bcrypt.compare(password, student.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { studentId: student.id, email: student.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { studentId: student.id, token: token, tokenExpiration: 1 };
  }
};
