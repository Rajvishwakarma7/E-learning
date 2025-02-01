import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Link } from "react-router-dom";

function Course({ courseItems }) {
  return (
    <>
      <Link to={`/course-detail/${courseItems._id}`}>
        <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="relative">
            <img
              src={courseItems?.courseThumbnail}
              alt="course"
              className="w-full h-36 object-cover rounded-t-lg"
            />
          </div>
          <CardContent className="px-5 py-4 space-y-3">
            <h1 className="hover:underline font-bold text-lg truncate">
              {courseItems?.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center gap-3">
                <Avatar className="h-10 w-10 ">
                  <AvatarImage
                    className="rounded-full h-full w-full"
                    src={
                      courseItems?.creator?.photoUrl ||
                      "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="font-medium text-sm">
                  {courseItems?.creator?.name || "N/A"}
                </h1>
              </div>
              <Badge
                className={
                  "bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
                }
              >
                {courseItems.courseLevel}
              </Badge>
            </div>
            <div className="text-lg font-bold">
              <span>₹{courseItems.coursePrice}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}

export default Course;
