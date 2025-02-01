import React from "react";
import "./App.css";
import Login from "./pages/Login";
import HeroSection from "./pages/Students/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import { RouterProvider } from "react-router";
import Courses from "./pages/Students/Courses";
import MyLearning from "./pages/Students/MyLearning";
import Profile from "./pages/Students/Profile";
import Dashboard from "./pages/Admin/dashboard/Dashboard";
import AdminSidebar from "./pages/Admin/AdminSidebar";
import CourseTable from "./pages/Admin/course/CourseTable";
import AddCourses from "./pages/Admin/course/AddCourses";
import EditCourse from "./pages/Admin/course/EditCourse";
import EditLecture from "./pages/Admin/lecture/EditLecture";
import CreateLecture from "./pages/Admin/lecture/CreateLecture";
import CourseDetail from "./pages/Students/CourseDetail";
function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "my-learning",
          element: <MyLearning />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "course-detail/:courseId",
          element: <CourseDetail />,
        },
        // admin routs start from here
        {
          path: "admin",
          element: <AdminSidebar />,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "course",
              element: <CourseTable />,
            },
            {
              path: "course/create",
              element: <AddCourses />,
            },
            {
              path: "course/:courseId",
              element: <EditCourse />,
            },
            {
              path: "course/:courseId/lecture",
              element: <CreateLecture />,
            },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: <EditLecture />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
