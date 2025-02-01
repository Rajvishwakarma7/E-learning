import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftToLine, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import apiservice from "@/service/Server";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useDeleteLectureMutation } from "@/Redux/Api/courseApi";

function EditLecture() {
  const [
    deleteLecture,
    { data, isLoading: deleteLectureLoading, error: lectureError, isSuccess },
  ] = useDeleteLectureMutation();
  const [isVideoFree, setisVideoFree] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureVideo, setlectureVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [videoUploadProgress, setvideoUploadProgress] = useState(0);
  const [isLoading, setisLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (location && location.hasOwnProperty("state")) {
      let lectureData = location.state;
      setisVideoFree(lectureData.isPreviewFree);
      setLectureTitle(lectureData.lectureTitle);
      // setlectureVideo(lectureData.lectureTitle);
      setVideoPreview(lectureData.videoUrl);
    } else {
      navigate(-1);
      return;
    }
  }, []);

  const validateTitle = (title) => {
    if (!title) return "Title is required.";
    if (title.length < 3) return "Title must be at least 3 characters long.";
    if (title.length > 100) return "Title cannot exceed 100 characters.";
    if (/[^a-zA-Z0-9\s]/.test(title)) {
      return "Title cannot contain special characters.";
    }
    return ""; // No error
  };

  const handleLectureTitleChange = (e) => {
    const value = e.target.value;
    setLectureTitle(value);

    const validationError = validateTitle(value);
    setTitleError(validationError);
  };

  const handleLectureVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validVideoTypes = ["video/mp4", "video/avi", "video/mkv"];
      if (validVideoTypes.includes(file.type)) {
        setlectureVideo(file);
        setVideoPreview(URL.createObjectURL(file));
        setError("");
      } else {
        setError("Please upload a valid video file (MP4, AVI, MKV).");
        setlectureVideo(null);
        setVideoPreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    const titleValidationError = validateTitle(lectureTitle);

    if (titleValidationError) {
      setTitleError(titleValidationError);
      return;
    }

    if (!lectureVideo) {
      setError("A video file is required.");
      return;
    }

    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("isVideoFree", isVideoFree);
    formData.append("lectureVideo", lectureVideo);
    try {
      setisLoading(true);
      let getReponse = await apiservice.put(
        `/lecture?lectureId=${params?.lectureId}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
            setvideoUploadProgress(percent);
          },
        }
      );

      if (getReponse.status === 200) {
        toast.success(getReponse.status.msg || "Lecture Update Successfully !");
        setisVideoFree(false);
        setLectureTitle("");
        setlectureVideo(null);
        setVideoPreview(null);
        setisLoading(false);
        navigate(-1);
      } else {
        toast.error("failed to upldate lecture !");
        setisVideoFree(false);
        setLectureTitle("");
        setlectureVideo(null);
        setVideoPreview(null);
        setisLoading(false);
        navigate(-1);
      }
    } catch (error) {
      setisLoading(false);
      console.log(error);
    }
  };

  async function removeLecture() {
    let lectureId = params?.lectureId;
    let deletedLecture = await deleteLecture(lectureId);
    if (
      deletedLecture &&
      deletedLecture.hasOwnProperty("data") &&
      deletedLecture.data.success
    ) {
      toast.success("lecture deleted successfully !");
      setisVideoFree(false);
      setLectureTitle("");
      setlectureVideo(null);
      setVideoPreview(null);
      setisLoading(false);
      navigate(-1);
    } else {
      toast.error("failed to delete lecture !");
      setisVideoFree(false);
      setLectureTitle("");
      setlectureVideo(null);
      setVideoPreview(null);
      setisLoading(false);
      navigate(-1);
    }
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftToLine />
          </Button>
          <h3 className="font-bold text-2xl text-slate-700">
            Update Your Lecture
          </h3>
        </div>
        <Card className="p-5 pl-10 mt-4 space-y-5">
          <section>
            <h5 className="font-bold text-slate-700">Edit Lecture</h5>
            <p className="text-slate-400">
              Make changes and click save when done
            </p>
            <Button
              variant="destructive"
              className="mt-3"
              onClick={removeLecture}
            >
              {deleteLectureLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Remove Lecture"
              )}
            </Button>
          </section>

          <div className="grid w-full max-w-2xl items-center gap-1.5">
            <Label htmlFor="lectureTitle">Title *</Label>
            <Input
              id="lectureTitle"
              type="text"
              name="lectureTitle"
              value={lectureTitle}
              onChange={handleLectureTitleChange}
              placeholder="Enter lecture title"
            />
            {titleError && (
              <p className="text-red-500 text-sm mt-1">{titleError}</p>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="lectureVideo">Video *</Label>
            <Input
              id="lectureVideo"
              type="file"
              accept="video/*"
              onChange={handleLectureVideo}
            />
            {isLoading && (
              <>
                <Progress value={videoUploadProgress} className="mt-3" />
                <p className="mt-1 text-center">
                  Upload {videoUploadProgress}%
                </p>
              </>
            )}

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {videoPreview && (
              <div className="mt-3">
                <Label>Preview:</Label>
                <video
                  controls
                  src={videoPreview}
                  className="w-full rounded-lg border mt-2"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isVideoFree"
              checked={isVideoFree}
              onCheckedChange={(checked) => {
                setisVideoFree(checked);
              }}
            />
            <Label htmlFor="isVideoFree">Is this video free?</Label>
          </div>

          <Button
            className="bg-slate-700"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </Card>
      </div>
    </>
  );
}

export default EditLecture;
