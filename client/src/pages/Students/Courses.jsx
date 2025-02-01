import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCoursesQuery } from "@/Redux/Api/courseApi";

function Courses() {
  const { data, isSuccess, isError, isLoading } = useGetPublishedCoursesQuery();
  console.log("data", data);
  if (isError) return <h1>Some error occurred while fetching courses.</h1>;

  return (
    <>
      <div className="bg-gray-50 ">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="font-bold text-3xl text-center mb-10">Our Courses</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            ) : (
              <>
                {data &&
                data?.courses &&
                Array.isArray(data?.courses) &&
                data?.courses.length ? (
                  <>
                    {data?.courses.map((courseItems) => (
                      <Course courseItems={courseItems} />
                    ))}
                  </>
                ) : (
                  <h3> No Courses Availabe</h3>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
