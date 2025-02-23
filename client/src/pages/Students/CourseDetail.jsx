import { useGetCourseDetailWithStatusQuery } from "@/Redux/Api/courseApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const [FreeVideosDetails, setFreeVideosDetails] = useState(null);
  const navigate = useNavigate();

  const { data, isLoading, refetch, isError } =
    useGetCourseDetailWithStatusQuery(courseId);

  const course = data?.course; // Ensure data exists before accessing course
  const purchased = data?.purchased; // Check if the course is purchased

  useEffect(() => {
    if (course?.lectures?.length > 0) {
      setFreeVideosDetails(course.lectures[0]);
    }
  }, [course]);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !course) return <h1>Failed to load course details</h1>;

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">Course Sub-title</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt?.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mb-12 my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Course Description Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h1 className="font-bold text-xl md:text-2xl text-gray-900">
              Description
            </h1>
            <p
              className="text-gray-700 text-sm leading-relaxed mt-2"
              dangerouslySetInnerHTML={{
                __html: course?.description || "No description available.",
              }}
            />
          </div>

          {/* Course Content Section */}
          <Card className="shadow-lg  rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-[#f9fafb] p-5 rounded-t-xl border-b">
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">
                Course Content
              </CardTitle>
              <CardDescription className="text-gray-600">
                <span className="font-bold text-gray-800">
                  {course?.lectures?.length || 0}
                </span>
                lectures
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-5">
              {course?.lectures?.map((lecture, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 text-sm p-3 rounded-md border hover:bg-gray-100 transition-all ${
                    lecture.isPreviewFree
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setFreeVideosDetails(lecture);
                    }
                  }}
                >
                  <span className="text-gray-600">
                    {lecture?.isPreviewFree ? (
                      <PlayCircle size={18} className="text-green-600" />
                    ) : (
                      <Lock size={18} className="text-gray-500" />
                    )}
                  </span>
                  <p className="text-gray-800 font-medium">
                    {lecture?.lectureTitle}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 ">
          <Card className="shadow-lg rounded-xl overflow-hidden bg-white">
            <CardContent className="p-5 flex flex-col">
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-black relative">
                {FreeVideosDetails?.videoUrl ? (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    url={FreeVideosDetails?.videoUrl}
                    controls={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    No preview available
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h1 className="text-lg font-semibold text-gray-800">
                  Lecture Title
                </h1>
                <p className="text-gray-600 text-sm">
                  {FreeVideosDetails?.lectureTitle ||
                    "No free lectures available"}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-800">
                  Course Price
                </h1>
                <h1 className="text-lg font-bold text-[#E0610A]">
                  ₹{course?.coursePrice || "N/A"}
                </h1>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full bg-gradient-to-r from-[#E0610A] to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  Continue Course
                </Button>
              ) : (
                <Button className="w-full bg-gradient-to-r from-[#E0610A] to-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all">
                  Buy Course
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
