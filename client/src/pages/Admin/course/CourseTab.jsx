import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/Redux/Api/courseApi";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function CourseTab() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [publishCourse, { isLoading: publishLoading }] =
    usePublishCourseMutation();

  const [editCourse, { data, isLoading, isError, error, isSuccess }] =
    useEditCourseMutation();

  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  // Handlers for inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const handleCourseLevelSelect = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnailImg", input.courseThumbnail);

    try {
      await editCourse({ formData, courseId });
    } catch (err) {
      console.error("Failed to update course:", err);
    }
  };

  // Update state when courseByIdData changes
  const course = courseByIdData?.course;
  useEffect(() => {
    if (courseByIdData?.course) {
      setInput({
        courseTitle: course.title,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [course]);
  // Show toast notifications for success and error
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course updated successfully!");
      navigate("/admin/course");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update course.");
    }
  }, [isSuccess, isError, data, error]);

  // Show loading state while fetching data
  if (courseByIdLoading) return <h1>Loading...</h1>;

  async function handlePublish(data) {
    let publishCourseData = await publishCourse({
      isPublish: data,
      courseId: courseId,
    });
    if (
      publishCourseData &&
      publishCourseData.hasOwnProperty("data") &&
      publishCourseData.data.success
    ) {
      toast.success("lecture publish/unpublish successfully !");
      refetch();
    } else {
      toast.error("Failed to publish/unpublish course!");
      refetch();
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Button
            disabled={
              course.lectures &&
              Array.isArray(course.lectures) &&
              course.lectures.length === 0
            }
            onClick={() => {
              handlePublish(course.isPublished ? false : true);
            }}
          >
            {course.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => console.log("Remove course")}
          >
            Remove Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={handleInputChange}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={handleInputChange}
              placeholder="Ex. Learn fullstack development from zero to hero."
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select
                value={input.category}
                onValueChange={handleCategorySelect}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={handleCourseLevelSelect}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={handleInputChange}
                placeholder="199"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={handleThumbnailSelect}
              accept="image/*"
            />
            {course && course.courseThumbnail ? (
              <img
                src={course.courseThumbnail}
                alt="Course Thumbnail Preview"
                className="h-64 my-2"
              />
            ) : previewThumbnail ? (
              <img
                src={previewThumbnail}
                alt="Course Thumbnail Preview"
                className="h-64 my-2"
              />
            ) : null}
          </div>
          <div>
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseTab;
