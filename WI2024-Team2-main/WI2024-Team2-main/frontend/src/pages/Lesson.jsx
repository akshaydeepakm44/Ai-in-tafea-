import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { createLesson, getSkills, getLessonPlans, updateLessonProgress } from "../services/lesson";
import { getClassesByFellow } from "../services/class";
import Switch from '@mui/material/Switch';
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import jsPDF AutoTable plugin
import { submitActivityRating, submitPerformanceRating } from "../services/feedback";

const AddLessonForm = ({ onClose, onAddLesson }) => {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    skills: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    grade: "",
    skills: "",
  });

  const [skillOptions, setSkillsOptions] = useState([]);
  const [classes, setClasses] = useState([]);

  const asyncGetSkills  = async () => {
    try {
      const response = await getSkills();
      console.log(response);
      if (response.status === 200) {
        setSkillsOptions(response.data.skills);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  }

  const asyncGetClasses = async () => {
    try {
      const response = await getClassesByFellow(localStorage.getItem("token"));
      console.log(response);
      if (response.status === 200) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  }

  useEffect(() => {
    console.log("Fetching skills and classes...");
    asyncGetSkills();
    asyncGetClasses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      name: "",
      grade: "",
      skills: "",
    });

    // Validate
    let hasError = false;
    const newErrors = {
      name: "",
      grade: "",
      skills: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    if (!formData.grade) {
      newErrors.grade = "Grade is required";
      hasError = true;
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill must be selected";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await createLesson(
        localStorage.getItem("token"),
        formData.name,
        formData.grade,
        formData.skills,
      );
      console.log("Lesson created:", response);

      if (response.status === 200) {
        alert("Lesson created successfully.");
        onAddLesson(response.data.lesson);
      }
    } catch (error) {
      console.error("Failed to create lesson:", error);
      alert("Failed to create lesson. Please try again.");
      return;
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Lesson</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border rounded-lg bg-purple-100 focus:outline-none focus:border-purple-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              className="w-full p-3 border rounded-lg bg-purple-100 focus:outline-none focus:border-purple-500"
            >
              <option value="">Choose Class</option>
              {
                classes && classes.map((c) => (
                  <option key={c._id} value={c._id}>grade - {c.standard}</option>
                ))
              }
            </select>
            {errors.grade && (
              <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="font-medium">Select Skills:</p>
            <div className="space-y-2 bg-purple-100 p-3 rounded-lg border">
              {Object.keys(skillOptions).map((skill) => (
                <label key={skillOptions[skill]} className="flex items-center space-x-2" >
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          skills: [...formData.skills, skill]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          skills: formData.skills.filter(s => s !== skill)
                        });
                      }
                    }}
                    className="form-checkbox h-4 w-4 text-purple-500"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const handleDownloadPDF = (lesson) => {
  const doc = new jsPDF();
  doc.text(`Activity Details for ${lesson.lesson_name}`, 10, 10);
  doc.autoTable({
    startY: 20,
    head: [['Field', 'Details']],
    body: [
      ['Date', formatDate(lesson.createdAt)],
      ['Topics Covered', lesson.skills.join(' , ')],
      ['Activity Details', `Students participated in interactive sessions focusing on ${lesson.skills.join(' , ').toLowerCase()}. The activities included group discussions, role-playing exercises, and practical demonstrations to reinforce learning objectives.`],
      ['Learning Outcomes', 'Enhanced understanding of core concepts, Improved practical application skills, Increased student engagement and participation, Successful completion of learning objectives'],
      ['Student Feedback', 'Overall positive response from students, with high engagement levels and active participation throughout the session.']
    ],
  });
  doc.save(`${lesson.lesson_name}_Activity_Details.pdf`);
};

const ActivityDetails = ({ lesson, onClose }) => {
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{lesson.lesson_name} Activity</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Date</h3>
            <p>{formatDate(lesson.createdAt)}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Topics Covered</h3>
            <p>{lesson.skills.join(' , ')}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Activity Details</h3>
            <p className="text-gray-700">
              Students participated in interactive sessions focusing on {lesson.skills.join(' , ').toLowerCase()}. 
              The activities included group discussions, role-playing exercises, and practical 
              demonstrations to reinforce learning objectives.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Learning Outcomes</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Enhanced understanding of core concepts</li>
              <li>Improved practical application skills</li>
              <li>Increased student engagement and participation</li>
              <li>Successful completion of learning objectives</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Student Feedback</h3>
            <p className="text-gray-700">
              Overall positive response from students, with high engagement levels 
              and active participation throughout the session.
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={() => handleDownloadPDF(lesson)}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center space-x-2"
          >
            <span>Download PDF</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const FeedbackModal = ({ lesson, onClose }) => {
  const [feedback, setFeedback] = useState({
    publicSpeaking: 50,
    leadership: 50,
    difficulty: 50,
    recommendation: 50
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Add navigate hook

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const activityRatingData = {
        fellowId: localStorage.getItem("token"),
        activityId: lesson.selectedActivityId,
        feedback: "Overall positive response from students.",
        skillRating: [
          `Public Speaking: ${feedback.publicSpeaking}`,
          `Leadership: ${feedback.leadership}`
        ]
      };

      const performanceRatingData = {
        fellowId: localStorage.getItem("token"),
        studentId: lesson.classId,
        activityId: lesson.selectedActivityId,
        rating: feedback.difficulty
      };

      await submitActivityRating(activityRatingData);
      await submitPerformanceRating(performanceRatingData);

      console.log("Feedback submitted:", feedback);
      onClose();
      // Update analytics page
      navigate("/analytics"); // Ensure navigation to analytics page
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto my-8">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
          <h2 className="text-2xl font-bold">Lesson Feedback</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-purple-200 p-4 rounded-lg">
              How did the activity go?
            </h3>
            <div className="space-y-6">
              {lesson.skills.map((topic) => (
                <div key={topic} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {topic}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={feedback[topic.toLowerCase().replace(' ', '')]}
                    onChange={(e) => setFeedback({
                      ...feedback,
                      [topic.toLowerCase().replace(' ', '')]: e.target.value
                    })}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 bg-purple-200 p-4 rounded-lg">
              Rate student Performance
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty Level
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={feedback.difficulty}
                  onChange={(e) => setFeedback({
                    ...feedback,
                    difficulty: e.target.value
                  })}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Too Easy</span>
                  <span>Too Difficult</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Would you recommend this activity?
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={feedback.recommendation}
                  onChange={(e) => setFeedback({
                    ...feedback,
                    recommendation: e.target.value
                  })}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Don't Recommend</span>
                  <span>Highly Recommend</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end sticky bottom-0 bg-white pb-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-purple-300 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Feedback</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const LessonPlans = () => {
  const [activeTab, setActiveTab] = useState("planned");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleProgressUpdate = async (lessonId, progress) => {
    try {
      const response = await updateLessonProgress(lessonId, progress);
      console.log(response);
      if (response.status === 200) {
        const updatedLessons = lessons.map((lesson) => {
          if (lesson._id === lessonId) {
            return response.data.lesson;
          }
          return lesson;
        });
        setLessons(updatedLessons.filter(lesson => !lesson.progress));
        setCompletedLessons(updatedLessons.filter(lesson => lesson.progress));
      }
    } catch (error) {
      console.error("Failed to update lesson progress:", error);
    }
  };

  const getAllLessonPlans = async  () => {
    try {
      const response = await getLessonPlans(localStorage.getItem("token"));
      console.log(response.data.lessonPlans);
      if (response.status === 200) {
        setLessons(response.data.lessonPlans.filter(lesson => !lesson.progress));
        setCompletedLessons(response.data.lessonPlans.filter(lesson => lesson.progress));
      }
    }
    catch (error) {
      console.error("Failed to fetch lessons:", error);
    }
  }

  useEffect(() => {
    console.log("Fetching lesson plans...");
    getAllLessonPlans();

  }, [])

  const formatDate = (isoDate) => {
    // Create a Date object
    const date = new Date(isoDate);

    // Format the date
    const day = date.getUTCDate(); // Get the day
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get the short month (e.g., Nov)

    // Combine into desired format
    const formattedDate = `${day} ${month}`;

    return formattedDate;
  }

  const navigate = useNavigate();

  const handleAddLesson = (newLesson) => {
    setLessons([...lessons, newLesson]);
  };

  const handleStartLesson = (lesson) => {
    navigate("/chat", { state: { lesson } });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="w-full bg-white">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("planned")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "planned"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Your Lesson Plans
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Completed Plans
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "planned" && (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center space-x-2"
                >
                  <span>Add Lesson</span>
                  <span className="text-xl">+</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {lessons?.map((lesson, index) => (
                  <div
                    key={index}
                    className="bg-pink-100 p-4 rounded-lg shadow-lg flex flex-col justify-between"
                  >
                    <div className="">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold mb-2">
                          {lesson.lesson_name}: {formatDate(lesson.createdAt)}
                        </h3>
                        <Switch
                          checked={lesson?.progress}
                          onChange={() => handleProgressUpdate(lesson._id, !lesson.progress)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </div>
                      <p className="text-gray-700 text-sm">{lesson?.skills?.join(' , ')}</p>
                    </div>
                    <button
                      onClick={() => handleStartLesson(lesson)}
                      className="mt-4 px-4 py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-md"
                    >
                      Start Now →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "completed" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {completedLessons.map((lesson, index) => (
                <div
                  key={index}
                  className="bg-pink-100 p-8 rounded-lg shadow-lg flex flex-col justify-between"
                >
                  <div >
                    <h3 className="text-lg font-semibold mb-2">
                    {lesson.lesson_name}: {formatDate(lesson.createdAt)}
                    </h3>
                    <p className="text-gray-700 text-sm">{lesson.skills.join(' , ')}</p>
                  </div>
                  
                  <div className="flex flex-col ">
                <button
                  onClick={() => setSelectedActivity(lesson)}
                  className="mt-4 px-4 py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-md"
                >
                  View Activity
                </button>
                <button
                  onClick={() => setSelectedFeedback(lesson)}
                  className="mt-4 px-4 py-2 text-white bg-pink-500 hover:bg-pink-600 rounded-md"
                >
                  Submit Feedback
                </button>
              </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => navigate("/classroom")}
        >
          Go to Classroom
        </button>

        {selectedFeedback && (
          <FeedbackModal
            lesson={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
          />
        )}

        {/* Activity Details Modal */}
        {selectedActivity && (
          <ActivityDetails
            lesson={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}

        {/* Add Lesson Form Modal */}
        {showAddForm && (
          <AddLessonForm
            onClose={() => setShowAddForm(false)}
            onAddLesson={handleAddLesson}
          />
        )}
      </div>
    </div>
  );
};

export default LessonPlans;
