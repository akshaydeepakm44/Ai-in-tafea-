import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSuggestedActivities, sendChatMessage } from "../services/chat";
import { updateSelectedActivity, updateSuggestedActivities } from "../services/lesson";

function Chat() {
  const location = useLocation();
  const lesson = location.state?.lesson || null;

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedActivityDetails, setSelectedActivityDetails] = useState(null);
  const [procedureSteps, setProcedureSteps] = useState(null);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const asyncupdateSuggestedActivities = async (activities) => {
    try {
      const res = await updateSuggestedActivities(lesson._id, activities);
      return res.data.activities;
    } catch (error) {
      console.error("Error updating suggested activities:", error);
      return [];
    }
  };

  const handleSelectedActivity = async (activityId, activityName) => {
    try {
      const res = await updateSelectedActivity(lesson._id, activityId);
      if (res.status === 200) {
        setMessages(prev => [
          ...prev,
          { type: "user", button: false, text: `I have selected Activity - ${activityName}` },
        ]);
        setSelectedActivityDetails({
          activityId,
          activityName,
          description: res.data.description,
          procedure: res.data.procedure
        });
      }
    } catch (error) {
      console.error("Error selecting activity:", error);
    }
  };

  const handleProcedureClick = (procedure) => {
    const steps = procedure.split('\n').map((step, index) => ({
      stepNumber: index + 1,
      stepDescription: step
    }));
    setProcedureSteps(steps);
    setMessages(prev => [
      ...prev,
      { type: "bot", text: "Here are the steps to complete the activity:" },
      ...steps.map(step => ({
        type: "bot",
        text: `Step ${step.stepNumber}: ${step.stepDescription}`
      }))
    ]);
  };

  useEffect(() => {
    const fetchSuggestedActivities = async () => {
      try {
        console.log("Fetching suggested activities for lesson:", lesson);
        const res = await getSuggestedActivities(localStorage.getItem("token"), lesson);
        console.log("Suggested activities response:", res);
        if (res.status === 200) {
          const activityIds = await asyncupdateSuggestedActivities(res.data.activities);
          setMessages([
            { type: "bot", button: false, text: "Here are some suggested activities:" },
            ...res.data?.activities?.map((activity, index) => ({
              type: "bot",
              button: true,
              activityId: activityIds[index],
              activityName: activity.activity_name,
              text: `Activity name: ${activity.activity_name}\nDescription: ${activity.description}\nProcedure: ${activity.procedure}`,
            })),
          ]);
        }
      } catch (error) {
        console.error("Error fetching suggested activities:", error.message);
        setMessages([{ type: "bot", button: false, text: "Error loading suggested activities." }]);
      }
    };

    if (lesson) {
      fetchSuggestedActivities();
    }
  }, [lesson]);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const newUserMessage = { type: "user", text: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      console.log("Sending message to backend:", userInput.trim());
      const response = await sendChatMessage({
        token: localStorage.getItem("token"),
        lesson,
        message: userInput.trim(),
        messageHistory: messages.map(msg => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.text
        }))
      });

      console.log("Response from backend:", response);

      if (response.status === 200) {
        setMessages(prev => [
          ...prev,
          { type: "bot", text: response.data.reply }
        ]);
      } else {
        console.error("Error response from server:", response);
        setMessages(prev => [
          ...prev,
          { type: "bot", text: "Sorry, there was an error processing your message." }
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "Sorry, there was an error processing your message." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {lesson && (
        <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center shadow-md">
          <div>
            <h1 className="text-2xl font-bold">{lesson.lesson_name}</h1>
            <p className="text-sm">
              <strong>Date:</strong> {formatDate(lesson.createdAt)}
            </p>
            <p className="text-sm">
              <strong>Topics:</strong> {lesson?.skills?.join(" , ")}
            </p>
          </div>
        </div>
      )}

      <div 
        className="flex-1 overflow-y-auto bg-white p-8"
        style={{ marginBottom: "70px" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg ${
                message.type === "user"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } ${message.button ? 'cursor-pointer' : ''} ${!message.button ? 'mb-[50px]' : ''}`}
              style={{ maxWidth: "70%" }}
              onClick={() => message.button ? handleSelectedActivity(message.activityId, message.activityName) : null}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {selectedActivityDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedActivityDetails.activityName}</h2>
              <button 
                onClick={() => setSelectedActivityDetails(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Description</h3>
                <p>{selectedActivityDetails.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Procedure</h3>
                <p className="cursor-pointer text-blue-500 hover:underline" onClick={() => handleProcedureClick(selectedActivityDetails.procedure)}>
                  {selectedActivityDetails.procedure}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {procedureSteps && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Procedure Steps</h2>
              <button 
                onClick={() => setProcedureSteps(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {procedureSteps.map((step) => (
                <div key={step.stepNumber}>
                  <h3 className="font-semibold text-lg">Step {step.stepNumber}</h3>
                  <p>{step.stepDescription}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-[70px] left-0 w-full bg-gray-100 border-t border-gray-200 p-4 flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || userInput.trim() === ""}
          className="ml-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg h-[70px] flex items-center justify-around">
        {/* Navigation buttons remain the same */}
      </nav>
    </div>
  );
}

export default Chat;
