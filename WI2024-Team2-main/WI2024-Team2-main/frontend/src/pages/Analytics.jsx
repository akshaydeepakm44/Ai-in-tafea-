import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClassesByFellow } from "../services/class";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // Import recharts components

const Analytics = ({ classId }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [marks, setMarks] = useState({});
  const [error, setError] = useState(null);
  const [classStandard, setClassStandard] = useState("");
  const navigate = useNavigate();

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

  const fetchStudents = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/students?classId=${classId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }
      const data = await response.json();
      setStudents(data.students.filter(student => student.classId === classId));
      const selectedClass = classes.find((classItem) => classItem && classItem._id === classId);
      setClassStandard(selectedClass ? selectedClass.standard : "");
      fetchMarks(classId);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setError("Error fetching students. Please try again later.");
    }
  };

  const fetchMarks = async (classId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/students/marks?classId=${classId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch marks");
      }
      const data = await response.json();
      const marksData = data.marks.reduce((acc, { studentId, marks }) => {
        acc[studentId] = { marks };
        return acc;
      }, {});
      setMarks(marksData);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleClassClick = (classId) => {
    setSelectedClass(classId);
    fetchStudents(classId);
  };

  const graphData = students.map((student) => ({
    name: student.name,
    marks: marks[student._id]?.marks || 0, // Default to 0 if no marks
  }));

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg mb-12 p-6 w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            classItem && (
              <div
                key={classIt em._id}
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
            <h3 className="text-xl font-bold mt-6">Analytics for Class {classStandard}</h3>
            <div className="mt-6 overflow-y-auto" style={{ maxHeight: "400px" }}>
              {students.length === 0 ? (
                <p className="text-gray-700 mt-4">There are no students in this class.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
