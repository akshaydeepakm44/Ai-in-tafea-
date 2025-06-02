import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  Book,
  Users,
  Clock,
  BookOpen,
  BarChart3,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFellowProfile } from "../services/fellow";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [fellowInfo, setFellowInfo] = useState({
    name: "",
    role: "",
    email: "",
    subject: "",
    experience: "",
    availabilityStatus: "",
    mobile: "",
  });
  
  const [showPopup, setShowPopup] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    experience: "",
    mobile: "",
  });

  const navigate = useNavigate();

  const asyncGetFellowProfile = async () => {
    try {
      const res = await getFellowProfile(localStorage.getItem("token"));
      console.log("API Response:", res);
      if (res.status === 200) {
        setFellowInfo(res.data);
        setEditForm({
          name: res.data.name,
          email: res.data.email,
          experience: res.data.experience,
          mobile: res.data.mobile,
        });
        console.log("Fellow Info:", res.data);
      }
    } catch (error) {
      console.error("Error fetching fellow profile:", error.message);
    }
  };

  useEffect(() => {
    asyncGetFellowProfile();
  }, []);

  const statsInfo = {
    activities: {
      completed: 0,
      PendingReports: 0,
    },
  };

  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/users/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setFellowInfo(prevState => ({
        ...prevState,  // Preserve the existing data
        ...editForm,   // Update only the fields that were edited
      }));
      setShowPopup(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile. Please try again.");
    }
  };

  const EditProfilePopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Experience</label>
            <input
              type="text"
              value={editForm.experience}
              onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Mobile</label>
            <input
              type="tel"
              value={editForm.mobile}
              onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#A393EB] text-white rounded-lg hover:bg-[#8A7CD4]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 bg-[#A393EB] rounded-full flex items-center justify-center text-white text-4xl font-semibold mb-4">
                {getInitials(fellowInfo.name)}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {fellowInfo.name || "No Name Set"}
              </h1>
              <p className="text-[#A393EB] font-medium">{fellowInfo.role || "Teaching Fellow"}</p>
            </div>

            {/* Contact Information */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-0 md:ml-8">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-[#A393EB]" />
                <span>{fellowInfo.email || "Email Not Set"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-[#A393EB]" />
                <span>Experience: {fellowInfo.experience || "Not Set"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-[#A393EB]" />
                <span>{fellowInfo.mobile || "Mobile Not Set"}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-medium">
              {fellowInfo.availabilityStatus || "Available"}
            </div>
          </div>
        </div>

        {/* Stats and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Activities Overview
              </h2>
              <Users className="w-5 h-5 text-[#A393EB]" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Completed</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {fellowInfo.activities?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#A393EB]"></div>
                  <span className="text-gray-600">Pending Reports</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {fellowInfo.activities?.PendingReports || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-3 bg-[#A393EB] text-white rounded-lg hover:bg-[#8A7CD4]"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Profile Popup */}
      {showPopup && <EditProfilePopup />}

    </div>
  );
};

export default Profile;
