import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import RootLayout from "./layouts/RootLayout";
import ErrorPage from './pages/ErrorPage';
import Login from "./pages/Login";
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import EditProfile from "./pages/EditProfile";
import Chat from './pages/Chat';
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage"; // Corrected import path
import Analytics from "./pages/Analytics";
import LessonPlans from "./pages/Lesson";
import ClassPage from "./pages/Class";
import ClassProgressReport from "./pages/Feedback";
import Classroom from "./pages/Classroom"; // Import Classroom component
import Resource from "./pages/Resource"; // Import Resource component
import Curriculum from './pages/Curriculum'; // Import Curriculum component
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

// Create a single router that handles all routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "edit-profile",
          element: <EditProfile />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "analytics",
          element: <Analytics />,
        },
        {
          path: "lessons",
          element: <LessonPlans />,
        },
        {
          path: "addclass",
          element: <ClassPage />,
        },
        {
          path: "Feedback",
          element: <ClassProgressReport />,
        },
        {
          path: "view-lessons",
          element: <LessonPlans />,
        },
        {
          path: "classroom",
          element: <Classroom />,
        },
        {
          path:"resource",
          element: <Resource />,
        },
        {
          path: "curriculum",
          element: <Curriculum />,
        }
      ],
    },
  ],
  {
    future: {
      v7_partialHydration: true,
    },
  }
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer /> {/* Add ToastContainer */}
    </>
  );
}

export default App;