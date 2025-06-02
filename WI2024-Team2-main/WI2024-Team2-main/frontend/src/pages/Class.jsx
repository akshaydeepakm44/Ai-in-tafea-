import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClass } from "../services/class";
import { getFellowProfile } from "../services/fellow"; // Import getFellowProfile

const ClassPage = ({ classId }) => {
  const [standardName, setStandardName] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [students, setStudents] = useState([]);
  const [fellowProfile, setFellowProfile] = useState({}); // State to store fellow profile
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFellowProfile = async () => {
      try {
        const response = await getFellowProfile(localStorage.getItem("token"));
        if (response.status === 200) {
          setFellowProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch fellow profile:", error);
      }
    };

    fetchFellowProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const handleAddStudent = async () => {
    if (name.trim() !== "" && id.trim() !== "" && standardName !== "") {
      const newStudent = {
        name: name.trim(),
        id: id.trim(),
        classStandard: standardName,
      };
      setStudents([...students, newStudent]);
      setName("");
      setId("");
    } else {
      alert("Please set a class standard and fill all fields.");
    }
  };

  const handleSubmit = () => {
    const asyncCreateClass = async () => {
      try {
        const response = await createClass(
          standardName,
          students.map((student) => ({ name: student.name, roll_no: student.id })),
          localStorage.getItem("token")
        );
        console.log("Class created:", response);
        if (response.status === 200) {
          alert("Class created successfully.");
          setStandardName("");
          setName("");
          setId("");
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to create class:", error);
      }
    };
    if (students.length > 0) {
      asyncCreateClass();
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Name,ID,Class Standard\n" +
        students
          .map((student) => `${student.name},${student.id},${student.classStandard}`)
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGoToClassroom = () => {
    navigate("/classroom");
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-blue-100">
      <div className="bg-white shadow-lg rounded-lg mb-12 p-6 w-full max-w-5xl">
        <div className="flex items-center justify-between space-x-6 ">
          <div className="flex items-center space-x-6">
            <div className="rounded-full w-20 h-20 bg-gray-300 flex items-center justify-center text-2xl font-bold text-white">
              {getInitials(fellowProfile.name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{fellowProfile.name}</h2>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={standardName}
                onChange={(e) => setStandardName(e.target.value)}
                placeholder="Enter class standard"
                className="border rounded py-2 px-4 flex-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="border rounded py-3 px-4 w-full"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
              ID
            </label>
            <input
              type="text"
              id="id"
              className="border rounded py-3 px-4 w-full"
              placeholder="Enter ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex space-x-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddStudent}
            >
              Add Student
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleGoToClassroom}
            >
              Go to Classroom
            </button>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Saved Students</h3>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{
              maxHeight: "300px", // Adjust based on the desired height
              overflowY: "auto", // Adds vertical scrolling
            }}
          >
            {students.map((student, index) => (
              <div key={index} className="bg-gray-100 shadow-md rounded-lg p-4">
                <p className="font-bold">Name: {student.name}</p>
                <p>ID: {student.id}</p>
                <p>Class Standard: {student.classStandard}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
