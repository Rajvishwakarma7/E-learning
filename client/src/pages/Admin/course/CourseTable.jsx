import { useGetCreatorCourseQuery } from "@/Redux/Api/courseApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formateDateTime } from "@/lib/utils";
import { Edit } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CourseTable() {
  const navigate = useNavigate();

  const { data: courseData, isLoading, refetch } = useGetCreatorCourseQuery();

  // console.log("data---------->>courses", courseData);
  return (
    <div className="p-4">
      <div className="flex justify-end pb-2">
        <Button type="button" onClick={() => navigate("create")}>
          Create a new Course
        </Button>
      </div>

      <Table>
        <TableCaption>
          A list of best courses created by instructor.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Titile</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <TableHead className="text-right">Last Update</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseData &&
            courseData.courses &&
            Array.isArray(courseData.courses) &&
            courseData.courses.length > 0 &&
            courseData.courses.map((courseItems, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {courseItems?.coursePrice || "NA"}
                </TableCell>
                <TableCell>
                  <Badge>
                    {courseItems.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{courseItems.title}</TableCell>
                <TableCell>{courseItems.category}</TableCell>

                <TableCell className="text-right">
                  {formateDateTime(courseItems.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  {formateDateTime(courseItems.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    // onClick={() => navigate(`/admin/course/${courseItems._id}`)}  // both way working we can use direct or use full path
                    onClick={() => navigate(courseItems._id)}
                  >
                    <Edit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default CourseTable;
