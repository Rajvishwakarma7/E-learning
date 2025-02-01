import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link
          to="lecture"
          className="underline hover:underline hover:text-blue-500"
        >
          Go to lectures page
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;
