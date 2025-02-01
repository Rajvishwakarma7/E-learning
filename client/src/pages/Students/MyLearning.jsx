import React from "react";
import Course from "./Course";

function MyLearning() {
  let isLoading = false;
  let myLearning = [1, 2, 3, 4, 5, 6];
  return (
    <>
      <div className="my-16 max-w-4xl mx-auto px-4 ">
        <h1 className="font-bold text-3xl ">My Learning</h1>
        <div className="my-5">
          {isLoading ? (
            <MyLearningSkeleton />
          ) : myLearning.length === 0 ? (
            <p>You are not enrolled in any course.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myLearning.map((course, index) => (
                <Course />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);
