import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useGetLectureQuery,
} from "@/Redux/Api/courseApi";
import { toast } from "sonner";
import { formateDateTime } from "@/lib/utils";
import { Card } from "@/components/ui/card";

function CreateLecture() {
  const navigate = useNavigate();
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const [
    deleteLecture,
    { isLoading: deleteLectureLoading, error: lectureError },
  ] = useDeleteLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureLoading,
    refetch,
  } = useGetLectureQuery(courseId);

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    if (lectureTitle !== "") {
      createLecture({ lectureTitle, courseId });
    } else {
      toast.success("Lecture is required !");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Lecture created successfully !");
    }
    if (error) {
      toast.error("Lecture create failed !");
    }
  }, [isSuccess, error]);

  async function removeLecture(lectureItems) {
    let lectureId = lectureItems?._id;
    let deletedLecture = await deleteLecture(lectureId);
    if (
      deletedLecture &&
      deletedLecture.hasOwnProperty("data") &&
      deletedLecture.data.success
    ) {
      toast.success("lecture deleted successfully !");
      refetch();
    } else {
      toast.error("failed to delete lecture !");
      refetch();
    }
  }

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div className="space-y-4">
        <form onSubmit={handleCreateLecture} className="space-y-4">
          <div>
            <Label>Lecture Title</Label>
            <Input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Your Lecture Name"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              // onClick={handleCreateLecture}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create Lecture"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <Card className="p-4">
            <Table>
              <TableCaption>
                A list of best courses created by instructor.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Lecture Index </TableHead>
                  <TableHead className="w-[100px]">Lecture title</TableHead>
                  <TableHead className="text-right">Created At</TableHead>
                  <TableHead className="text-right">Last Update</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lectureData &&
                  lectureData.lectures &&
                  Array.isArray(lectureData.lectures) &&
                  lectureData.lectures.length > 0 &&
                  lectureData.lectures.map((lectureItems, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        Lecture -- {index} :
                      </TableCell>

                      <TableCell className="font-medium">
                        {lectureItems.lectureTitle}
                      </TableCell>

                      <TableCell className="text-right">
                        {formateDateTime(lectureItems.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formateDateTime(lectureItems.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(lectureItems._id, { state: lectureItems })
                          }
                        >
                          <Edit />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            removeLecture(lectureItems);
                          }}
                        >
                          <Trash2 className="text-red-700 font-bold" />
                          {/* {deleteLectureLoading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Please wait
                            </>
                          ) : (
                          )} */}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;
