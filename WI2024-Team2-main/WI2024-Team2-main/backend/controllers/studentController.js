const { Student } = require('../models/model');

const saveMarks = async (req, res) => {
  try {
    const marks = req.body;

    for (const studentId in marks) {
      const student = await Student.findById(studentId);
      if (student) {
        student.marks = marks[studentId].marks;
        await student.save();
      }
    }

    res.status(200).json({ message: 'Marks saved successfully' });
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const moveStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStandard } = req.body;

    console.log("Moving student:", id, "to standard:", newStandard); // Debug log

    const student = await Student.findById(id);
    if (!student) {
      console.error("Student not found:", id); // Debug log
      return res.status(404).json({ message: 'Student not found' });
    }

    student.classStandard = newStandard;
    await student.save();

    console.log("Student moved successfully:", student); // Debug log

    res.status(200).json(student);
  } catch (error) {
    console.error("Error moving student:", error); // Debug log
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { saveMarks, getAllStudents, moveStudent };
