import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="w-full px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-serif italic text-purple-600">
            Teach for India
          </h1>
          <div className="flex space-x-6">
            
            
          <Link
  to="/login"
  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
>
  Log In
</Link>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="w-full px-8 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Key Highlights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Key Challenges Addressed */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-purple-600 mb-4">
              Key Challenges Addressed
            </h3>
            <ul className="list-disc pl-4 space-y-2 text-gray-700">
              <li>Limited space</li>
              <li>Scarce resources</li>
              <li>Need for simple, step-by-step guidance</li>
              <li>
                School administrators, parents, TFI fellows, and students
              </li>
            </ul>
          </div>

          {/* Target Users */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              Target Users
            </h3>
            <p className="text-gray-700">
              TFI fellows (teachers) and students.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Key Benefits
            </h3>
            <ul className="list-disc pl-4 space-y-2 text-gray-700">
              <li>Structured activity plans</li>
              <li>Video guidance</li>
              <li>Resource-conscious planning</li>
            </ul>
          </div>

          {/* Teach for India */}
          <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold text-pink-600 mb-4">
              Teach for India
            </h3>
            <p className="text-gray-700">
              TFI addresses educational inequality by placing passionate fellows
              in under-resourced schools. They provide innovative teaching
              methods and personalized attention. TFI empowers underprivileged
              students to excel academically and thrive as future leaders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
