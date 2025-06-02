import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFellowProfile } from "../services/fellow"; // Import the same service used in Profile component

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Guest",
  });

  // Function to get initials from name
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('token');
    if (!token && location.pathname !== '/login') {
      navigate('/login');
      return;
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const res = await getFellowProfile(token);
        if (res.status === 200) {
          setUserInfo(res.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
        // Handle error appropriately - could redirect to login or show error message
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();

      if (currentTime >= expirationTime) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the auth token
    setUserInfo({ name: "Guest" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 z-50">
      {/* Top Bar */}
      <header className="bg-white shadow-lg px-4 py-3 flex items-center justify-between z-50">
        {/* Left: Dropdown Button */}
        <div className="relative">
          <button
            className="text-gray-700 font-medium px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ☰ Menu
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-lg w-48">
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/lessons"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                View Lessons
              </Link>
              <Link
                to="/addclass"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Add Students
              </Link>
              <Link
                to="/chat"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Chat
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/Resource"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Resource
              </Link>
              <Link
                to="/Curriculum"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Cirriculum
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Right: Profile Picture and Name */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium text-gray-700">
            {userInfo.name}
          </span>
          <div className="w-10 h-10 bg-[#A393EB] rounded-full flex items-center justify-center text-white text-lg font-semibold">
            {getInitials(userInfo.name)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#A393EB] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/dashboard"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-9 9 9M9 21V9h6v12"
                />
              </svg>
              <span>Dashboard</span>
            </Link>

            {/* Lessons Link */}
            <Link
              to="/lessons"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/lessons"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.707 9.707 0 01-4-.812l-4.243 1.061a1 1 0 01-1.235-1.235l1.06-4.243A9.707 9.707 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Lessons</span>
            </Link>

            {/* Feedback Link */}
            <Link
              to="/feedback"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/feedback"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.707 9.707 0 01-4-.812l-4.243 1.061a1 1 0 01-1.235-1.235l1.06-4.243A9.707 9.707 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Feedback</span>
            </Link>

            {/* Analytics Link */}
            <Link
              to="/analytics"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/analytics"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.707 9.707 0 01-4-.812l-4.243 1.061a1 1 0 01-1.235-1.235l1.06-4.243A9.707 9.707 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Analytics</span>
            </Link>

            {/* Profile Link */}
            <Link
              to="/profile"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/profile"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A13.937 13.937 0 0112 15c2.387 0 4.627.563 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm-8 10a8 8 0 1116 0H7z"
                />
              </svg>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default RootLayout;