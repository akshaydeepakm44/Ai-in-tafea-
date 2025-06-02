import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getClassesByFellow } from "../services/class"; // Import the service to fetch classes
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const Classroom = ({ classId }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [marks, setMarks] = useState({});
  const [error, setError] = useState(null);
  const [classStandard, setClassStandard] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [classDetails, setClassDetails] = useState({});
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({ roll_no: "", classStandard: "" });
  const [showEditPopup, setShowEditPopup] = useState(false); // State to control the popup visibility
  const [showEditForm, setShowEditForm] = useState(false); // State to control the edit form visibility
  const [showActions, setShowActions] = useState(false); // State to control the actions visibility
  const [showMoveForm, setShowMoveForm] = useState(false); // State to control the move form visibility
  const [selectedStandard, setSelectedStandard] = useState(""); // State to store the selected standard
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetching classes initially when the component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getClassesByFellow(localStorage.getItem("token"));
        setClasses(response.data.classes);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Error fetching classes. Please try again later.");
      }
    };
    fetchClasses();
  }, []);

  // Fetching students and their marks when a class is selected
  const fetchStudents = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/students?classId=${classId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data.students.filter(student => student.classId === classId)); // Filter students by classId
      const selectedClass = classes.find((classItem) => classItem && classItem._id === classId);
      setClassStandard(selectedClass ? selectedClass.standard : "");
      fetchMarks(classId); // Fetch the marks after fetching students
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]); // Clear students data if fetching fails
      setError("Error fetching students. Please try again later.");
    }
  };

  // Fetching saved marks for the selected class
  const fetchMarks = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/students/marks?classId=${classId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch marks");
      }
      const data = await response.json();
      const marksData = data.marks.reduce((acc, { studentId, marks }) => {
        acc[studentId] = { marks }; // Map marks to studentId
        return acc;
      }, {});
      setMarks(marksData); // Update the marks state with the fetched data
      // Optionally store marks in localStorage for persistence
      localStorage.setItem('marks', JSON.stringify(marksData));
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleClassClick = (classId) => {
    setSelectedClass(classId);
    fetchStudents(classId);
  };

  const handleMarksChange = (studentId, value) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: {
        ...prevMarks[studentId],
        marks: value, // Only update the marks property for the student
      },
    }));
  };

  // Save marks to the backend and update state
  const handleSaveMarks = async () => {
    try {
      const marksToSave = Object.keys(marks).reduce((acc, studentId) => {
        acc.push({ studentId, marks: marks[studentId].marks });
        return acc;
      }, []);

      const response = await fetch("http://localhost:5002/api/students/saveMarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId: selectedClass, marks: marksToSave }),
      });

      if (!response.ok) {
        throw new Error("Failed to save marks");
      }

      toast.success("Marks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Failed to save marks. Please try again.");
    }
  };

  const handleAddStudent = () => {
    if (name.trim() !== "" && id.trim() !== "" && selectedClass) {
      const newStudent = {
        name: name.trim(),
        roll_no: id.trim(),
        classId: selectedClass,
      };
      setStudents((prevStudents) => [...prevStudents, newStudent]);
      setName("");
      setId("");
      toast.success("Student added successfully!");
    } else {
      alert("Please select a class and fill all fields.");
    }
  };

  const handleDeleteClass = (classId) => {
    setClasses((prevClasses) => prevClasses.filter((classItem) => classItem && classItem._id !== classId));
    if (selectedClass === classId) {
      setSelectedClass(null);
      setStudents([]);
      setClassStandard("");
      setMarks({}); // Clear marks when class is deleted
    }
  };

  const handleViewLessons = () => {
    navigate("/lessons");
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Name", "Roll No", "Marks"],
      ...students.map((student) => [
        student.name,
        student.roll_no,
        marks[student._id]?.marks || "N/A",
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Class_${classStandard}_Marks.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load marks from localStorage on page load (for persistence across page reload)
  useEffect(() => {
    const savedMarks = JSON.parse(localStorage.getItem('marks'));
    if (savedMarks) {
      setMarks(savedMarks);
    }
  }, []);

  const fetchClassDetails = async () => {
    // Fetch class details from API
    // ...existing code...
  };

  const handleEditClass = () => {
    setShowEditPopup(true); // Show the edit popup
    setShowEditForm(false); // Hide the edit form initially
    setShowActions(true); // Show the actions
  };

  const handleEditStudent = (studentId) => {
    const student = students.find(student => student._id === studentId);
    if (student) {
      setEditStudentId(studentId);
      setEditStudentData({ roll_no: student.roll_no, classStandard: student.classStandard });
      setShowEditForm(true); // Show the edit form
    }
  };

  const handleSaveEditStudent = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/students/${editStudentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editStudentData),
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudent = await response.json();
      setStudents(prevStudents => prevStudents.map(student => student._id === editStudentId ? updatedStudent : student));
      setEditStudentId(null);
      setEditStudentData({ roll_no: "", classStandard: "" });
      setShowEditForm(false); // Hide the edit form

      if (editStudentData.classStandard !== classStandard) {
        // Move student to the new class
        setStudents(prevStudents => prevStudents.filter(student => student._id !== editStudentId));
        fetchStudents(selectedClass);
      }

      toast.success("Student updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student. Please try again.");
    }
  };

  const handleMoveStudent = async () => {
    try {
      console.log("Moving student:", editStudentId, "to standard:", selectedStandard); // Debug log

      const response = await fetch(`http://localhost:5002/api/students/move/${editStudentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStandard: selectedStandard }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from API:", errorText); // Debug log
        throw new Error(errorText || "Failed to move student");
      }

      const updatedStudent = await response.json();
      console.log("Student moved successfully:", updatedStudent); // Debug log

      setStudents(prevStudents => prevStudents.filter(student => student._id !== editStudentId));
      fetchStudents(selectedClass);

      toast.success("Student moved successfully!");
    } catch (error) {
      console.error("Error moving student:", error); // Debug log
      toast.error(`Failed to move student. Please try again. Error: ${error.message}`);
    }
  };

  const handleRemoveStudent = (studentId) => {
    setStudents(prevStudents => prevStudents.filter(student => student._id !== studentId));
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg mb-12 p-6 w-full max-w-5xl">
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={handleViewLessons}
        >
          View Lessons Page
        </button>
        <h2 className="text-2xl font-bold mb-4">Classroom</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            classItem && (
              <div
                key={classItem._id}
                className="bg-gray-100 shadow-md rounded-lg p-4 cursor-pointer w-64 h-32"
                onClick={() => handleClassClick(classItem._id)}
              >
                <p className="font-bold">Class: {classItem.standard}</p>
              </div>
            )
          ))}
        </div>
        {selectedClass && (
          <>
            <h3 className="text-xl font-bold mt-6">Students in Class {classStandard}</h3>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleEditClass}
            >
              Edit Class
            </button>
            {students.length === 0 ? (
              <p className="text-gray-700 mt-4">There are no students in this class.</p>
            ) : (
              <div className="overflow-y-auto mt-4" style={{ maxHeight: "400px" }}>
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Roll No</th>
                      <th className="py-2 px-4 border-b">Marks</th>
                      {showActions && <th className="py-2 px-4 border-b">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="py-2 px-4 border-b">{student.name}</td>
                        <td className="py-2 px-4 border-b">{student.roll_no}</td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="number"
                            placeholder="Enter marks"
                            value={marks[student._id]?.marks || ""}
                            onChange={(e) => handleMarksChange(student._id, e.target.value)}
                            className="border rounded py-2 px-4 w-full"
                          />
                        </td>
                        {showActions && (
                          <td className="py-2 px-4 border-b">
                            <button onClick={() => handleEditStudent(student._id)}>Edit</button>
                            <button onClick={() => handleRemoveStudent(student._id)}>Remove</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {students.length > 0 && (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={handleSaveMarks}
                >
                  Save Marks
                </button>
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
                  onClick={handleDownloadCSV}
                >
                  Download Marks
                </button>
              </>
            )}
          </>
        )}
      </div>
      {showEditPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            {showEditForm ? (
              <>
                <h3 className="text-xl font-bold mb-4">Edit Student</h3>
                <div className="mt-2">
                  <label className="block text-gray-700">Roll No:</label>
                  <input
                    type="text"
                    value={editStudentData.roll_no}
                    onChange={(e) => setEditStudentData({ ...editStudentData, roll_no: e.target.value })}
                    className="border rounded py-2 px-4 w-full"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-gray-700">Class Standard:</label>
                  <input
                    type="text"
                    value={classStandard}
                    onChange={(e) => setEditStudentData({ ...editStudentData, classStandard: e.target.value })}
                    className="border rounded py-2 px-4 w-full"
                  />
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
                  onClick={handleSaveEditStudent}
                >
                  Save
                </button>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
                  onClick={() => setShowMoveForm(true)}
                >
                  Move
                </button>
                {showMoveForm && (
                  <div className="mt-4">
                    <label className="block text-gray-700">Select New Standard:</label>
                    <select
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                      className="border rounded py-2 px-4 w-full"
                    >
                      <option value="">Select Standard</option>
                      {classes.map((classItem) => (
                        <option key={classItem._id} value={classItem.standard}>
                          {classItem.standard}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
                      onClick={handleMoveStudent}
                    >
                      Confirm Move
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Edit Class</h3>
                <div className="overflow-x-auto" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Roll No</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="py-2 px-4 border-b">{student.name}</td>
                          <td className="py-2 px-4 border-b">{student.roll_no}</td>
                          <td className="py-2 px-4 border-b">
                            <button onClick={() => handleEditStudent(student._id)}>Edit</button>
                            <button onClick={() => handleRemoveStudent(student._id)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => setShowEditPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
