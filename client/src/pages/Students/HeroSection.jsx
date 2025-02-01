import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
      <div className=" max-w-3xl mx-auto ">
        <h1 className="text-white text-4xl font-bold mb-4">
          Find Best Courses for You !
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <form action="" className="flex rounded-full bg-white ">
          <Input
            placeholder="Search Courses"
            className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <Button className="rounded-r-full bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </form>
        <Button className="rounded-full bg-white text-gray-500 hover:bg-white  mt-6">
          Explore Courses
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
