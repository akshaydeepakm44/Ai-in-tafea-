import React, { useState } from "react";

const curriculumData = {
  Confidence: [
    "Step 1: Start by speaking up in small groups.",
    "Step 2: Practice eye contact while talking.",
    "Step 3: Engage in public speaking opportunities.",
    "Step 4: Record yourself speaking and review.",
    "Step 5: Take constructive feedback and improve.",
  ],
  Communication: [
    "Step 1: Practice active listening.",
    "Step 2: Speak clearly and confidently.",
    "Step 3: Engage in conversations with diverse people.",
    "Step 4: Work on verbal and non-verbal cues.",
    "Step 5: Participate in debates or discussions.",
  ],
  Empathy: [
    "Step 1: Observe and understand different perspectives.",
    "Step 2: Practice listening without interrupting.",
    "Step 3: Engage in role-playing activities.",
    "Step 4: Read about different cultures and experiences.",
    "Step 5: Volunteer for social service activities.",
  ],
  Leadership: [
    "Step 1: Take responsibility for small tasks.",
    "Step 2: Develop decision-making skills.",
    "Step 3: Learn how to motivate a team.",
    "Step 4: Handle conflicts and find solutions.",
    "Step 5: Take initiative in organizing events.",
  ],
  "Problem-solving": [
    "Step 1: Break problems into smaller parts.",
    "Step 2: Develop critical thinking by asking questions.",
    "Step 3: Try solving real-world problems.",
    "Step 4: Work on brain teasers and puzzles.",
    "Step 5: Learn from failures and adjust strategies.",
  ],
  "Self-discipline": [
    "Step 1: Set clear daily goals.",
    "Step 2: Avoid distractions and stay focused.",
    "Step 3: Develop a consistent routine.",
    "Step 4: Hold yourself accountable for tasks.",
    "Step 5: Reflect and improve based on experiences.",
  ],
  "Time management": [
    "Step 1: Prioritize tasks based on importance.",
    "Step 2: Use a planner to track daily activities.",
    "Step 3: Avoid procrastination and manage breaks.",
    "Step 4: Set deadlines and stick to them.",
    "Step 5: Regularly assess and adjust time strategies.",
  ],
};

const Curriculum = () => {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleSelection = (event) => {
    setSelectedSkill(event.target.value);
    setCurrentStep(0); // Reset step progression on new selection
  };

  const handleNextStep = () => {
    if (currentStep < curriculumData[selectedSkill].length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Select a Skill</h2>
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          onChange={handleSelection}
          value={selectedSkill}
        >
          <option value="">-- Choose a skill --</option>
          {Object.keys(curriculumData).map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        {selectedSkill && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Curriculum for {selectedSkill}
            </h3>
            {curriculumData[selectedSkill].map((step, index) => (
              <div
                key={index}
                className={`p-3 mb-2 rounded border ${
                  index <= currentStep
                    ? "bg-blue-100 border-blue-400"
                    : "bg-gray-200 border-gray-400"
                }`}
              >
                {step}
                {index === currentStep && (
                  <button
                    className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                    onClick={handleNextStep}
                  >
                    {index === curriculumData[selectedSkill].length - 1
                      ? "Complete"
                      : "Next Step"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Curriculum;