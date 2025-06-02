import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const ClassProgressReport = ({ classData }) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("L-10");
  const [students, setStudents] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });
  const [classes, setClasses] = useState([]);

  // Initial skills template
  const initialSkills = [
    { name: "Public Speaking", score: 0 },
    { name: "Teamwork", score: 0 },
    { name: "Critical Thinking", score: 0 },
    { name: "Problem Solving", score: 0 },
  ];

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
    setStudents(storedStudents.map((student) => ({
      ...student,
      skills: [...initialSkills],
    })));

    const uniqueClasses = [...new Set(storedStudents.map(student => student.standard))];
    setClasses(uniqueClasses);
  }, [classData, selectedClass]);

  const handleSkillScoreChange = (studentId, skillIndex, score) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              skills: student.skills.map((skill, index) =>
                index === skillIndex
                  ? { ...skill, score: Number(score) }
                  : skill
              ),
            }
          : student
      )
    );
    setSaveStatus({ type: "", message: "" });
  };

  const validateScores = () => {
    for (const student of students) {
      for (const skill of student.skills) {
        const score = Number(skill.score);
        if (isNaN(score) || score < 0 || score > 10) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSaveProgress = async () => {
    if (!selectedClass || !selectedActivity) {
      setSaveStatus({
        type: "error",
        message: "Please select both class and activity",
      });
      return;
    }

    if (!validateScores()) {
      setSaveStatus({
        type: "error",
        message: "All scores must be between 0 and 10",
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus({ type: "", message: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataToSave = {
        class: selectedClass,
        activity: selectedActivity,
        students: students.map(student => ({
          id: student.id,
          name: student.name,
          skills: student.skills
        }))
      };

      console.log("Saving progress data:", dataToSave);

      setSaveStatus({
        type: "success",
        message: "Progress saved successfully!",
      });
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: "Failed to save progress. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full mt-8"> {/* Added top margin */}
      <div className="mx-6"> {/* Added horizontal margin */}
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6"> {/* Increased bottom margin */}
          <h1 className="text-2xl font-bold">Class Progress Report</h1>
          <div className="flex gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 rounded bg-pink-200 text-black"
            >
              <option value="">Select Class</option>
              {classes.map((className, index) => (
                <option key={index} value={className}>{className}</option>
              ))}
            </select>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="px-4 py-2 rounded bg-pink-200 text-black"
            >
              <option value="L-10">Activity L-10</option>
              <option value="L-1">Activity L-1</option>
              <option value="L-2">Activity L-2</option>
              <option value="L-3">Activity L-3</option>
            </select>
          </div>
        </div>

        {/* Student Section Header */}
        <div className="w-full bg-pink-200 p-2 mb-6"> {/* Increased bottom margin */}
          <span className="font-medium">Student</span>
        </div>

        {/* Content Section */}
        {students.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p>No data available. Please save data from the Lesson page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border text-left">Student Name</th>
                  <th className="px-4 py-2 border text-left">ID</th>
                  {initialSkills.map((skill, index) => (
                    <th key={index} className="px-4 py-2 border">
                      {skill.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-2 border">{student.name}</td>
                    <td className="px-4 py-2 border">{student.id}</td>
                    {student.skills.map((skill, index) => (
                      <td key={index} className="px-4 py-2 border">
                        <input
                          type="number"
                          value={skill.score}
                          onChange={(e) =>
                            handleSkillScoreChange(
                              student.id,
                              index,
                              e.target.value
                            )
                          }
                          className="w-full border rounded py-1 px-2"
                          min="0"
                          max="10"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Save Progress Button and Status Message */}
        <div className="flex flex-col items-end gap-2 mt-6"> {/* Increased top margin */}
          {saveStatus.message && (
            <div
              className={`px-4 py-2 rounded ${
                saveStatus.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {saveStatus.message}
            </div>
          )}
          <button
            onClick={handleSaveProgress}
            disabled={isSaving}
            className={`flex items-center gap-2 bg-pink-300 text-black px-4 py-2 rounded hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassProgressReport;