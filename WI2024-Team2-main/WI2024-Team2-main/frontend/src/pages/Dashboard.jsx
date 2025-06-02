
// Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="w-full px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-serif italic">Welcome to Tafea!</h1>
        </div>
      </nav>

      <div className="w-full px-8 py-8">
        <div className="mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">About the Dashboard</h2>
            <p className="text-gray-700 mb-4">
              This project aims to transform extracurricular activities in under-resourced schools by providing a structured and engaging assistant for Teach For India fellows.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                Designed to support fellows in conducting impactful activities.
              </li>
              <li>
                Simplifies lesson planning with resource-conscious templates.
              </li>
              <li>
                Offers video-based guidance for effective implementation.
              </li>
              <li>
                Enhances student experiences, even with limited supplies or space.
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/analytics" className="block">
            <div className="bg-purple-100 text-purple-900 p-6 rounded-xl shadow-md hover:bg-purple-200 transition">
              <h3 className="text-xl font-semibold">Analytics</h3>
              <p className="text-gray-600 mt-2">
                Dive into your analytics dashboard to track your performance.
              </p>
              <p className="text-purple-500 mt-4">Explore →</p>
            </div>
          </Link>
          <div className="bg-green-100 text-green-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Progress Tracker</h3>
            <p className="text-gray-600 mt-2">
              Monitor your progress and stay on top of your goals.
            </p>
          </div>
          <div className="bg-blue-100 text-blue-900 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Upcoming Activities</h3>
            <p className="text-gray-600 mt-2">
              Stay informed about upcoming events and tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;