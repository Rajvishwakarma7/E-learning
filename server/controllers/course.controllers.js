import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteCloudinaryMedia, uploadMedia } from "../utils/cloudinary.js";
import fs from "fs";
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res
        .status(400)
        .json({ msg: "courseTitle or category are required" });
    }
    const course = await Course.create({
      title: courseTitle,
      category: category,
      creator: req.id,
    });
    return res
      .status(200)
      .json({ msg: "course created", course, success: true });
  } catch (error) {
    console.log("createCourse  ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

// get all courses by creator id
export const getCreatorCourse = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.id });
    return res.status(200).json({ msg: "course List", courses, success: true });
  } catch (error) {
    console.log("getCourse  ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Courses",
    });
  }
};

// update course
export const editCourse = async (req, res) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const courseThumbnailImg = req.file;

    const { courseId } = req.query;
    if (!courseId) {
      if (courseThumbnailImg) {
        fs.unlinkSync(courseThumbnailImg.path);
      }
      return res.status(400).json({ msg: "courseId are required" });
    }
    if (
      courseThumbnailImg &&
      !allowedImageTypes.includes(courseThumbnailImg.mimetype)
    ) {
      fs.unlinkSync(courseThumbnailImg.path);
      return res.status(400).json({ msg: "Only Image files are allowed" });
    }
    let course = await Course.findById({ _id: courseId });
    if (!course) {
      if (courseThumbnailImg) {
        fs.unlinkSync(courseThumbnailImg.path);
      }
      return res.status(400).json({ msg: "No Course is available" });
    }

    const updateCourseData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    };

    // for thumbnail
    if (courseThumbnailImg) {
      if (course.courseThumbnail) {
        let thumbnailId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteCloudinaryMedia(thumbnailId); // delete old image
      }

      let courseCloudinaryRes = await uploadMedia(courseThumbnailImg.path); // upload new image
      updateCourseData.courseThumbnail = courseCloudinaryRes.secure_url;
    }

    course = await Course.findByIdAndUpdate(courseId, updateCourseData, {
      new: true,
    });
    return res
      .status(200)
      .json({ msg: "course update successfully ", course, success: true });
  } catch (error) {
    console.log("EditCourse  ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Update Courses",
    });
  }
};

// get course info by it's id
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ msg: "courseId are required" });
    }
    let course = await Course.findById({ _id: courseId });
    if (!course) {
      return res
        .status(400)
        .json({ msg: "course not found , please create course !" });
    }
    return res
      .status(200)
      .json({ msg: " course details ", course, success: true });
  } catch (error) {
    console.log("EditCourse  ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Courses",
    });
  }
};

// create lecture
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.query;

    if (!lectureTitle || !courseId) {
      return res
        .status(400)
        .json({ msg: "courseId or lecture Title are required" });
    }

    let course = await Course.findById({ _id: courseId });
    if (!course) {
      return res
        .status(400)
        .json({ msg: "course not found , please create course !" });
    }

    let lecture = await Lecture.create({ lectureTitle: lectureTitle });
    course.lectures.push(lecture._id);
    await course.save();
    return res
      .status(200)
      .json({ msg: "lecture created successfully", course, success: true });
  } catch (error) {
    console.log("create Lecture  ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Lecture",
    });
  }
};

// get lecture List by course Id

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({ msg: "courseId Title are required" });
    }
    let course = await Course.findById({ _id: courseId });
    if (!course) {
      return res
        .status(400)
        .json({ msg: "course not found , please create course !" });
    }
    // Check for lectures
    if (course.lectures.length === 0) {
      return res.status(200).json({ LectureData: [], success: true });
    }
    // if (course.lectures.length > 0) {
    //   let LectureData = await Promise.all(
    //     course.lectures.map(async (lectureId) => {
    //       return await Lecture.find({ _id: lectureId });
    //     })
    //   );
    //   return res.status(200).json({ LectureData, success: true });
    // }

    // without using loop we can use $in inbuild method of mongo--------->>>

    let lectureIds = course.lectures;
    const lectures = await Lecture.find({ _id: { $in: lectureIds } }).lean();
    return res.status(200).json({ lectures, success: true });
  } catch (error) {
    console.log("get lecture list  ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture",
    });
  }
};

// update lecture title or video

export const updateLecture = async (req, res) => {
  const lectureVideo = req?.file;
  const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
  ];

  try {
    const { lectureTitle, isVideoFree } = req.body;
    const { lectureId } = req.query;
    if (!lectureId || !lectureTitle) {
      if (lectureVideo) {
        fs.unlinkSync(lectureVideo.path);
      }
      return res.status(400).json({ msg: "lectureId or title are required" });
    }

    if (lectureVideo && !allowedVideoTypes.includes(lectureVideo.mimetype)) {
      fs.unlinkSync(lectureVideo.path);
      return res.status(400).json({ msg: "Only video files are allowed" });
    }

    let lecture = await Lecture.findById({ _id: lectureId });
    if (!lecture) {
      if (lectureVideo) {
        fs.unlinkSync(lectureVideo.path);
      }
      return res.status(400).json({ msg: "lecture not found !" });
    }

    let updatedLecture = {
      lectureTitle: lectureTitle,
      isPreviewFree: isVideoFree,
    };

    if (lectureVideo) {
      if (lecture.videoUrl) {
        await deleteCloudinaryMedia(lecture.publicId);
      }
      const uploadVideo = await uploadMedia(lectureVideo.path);
      updatedLecture.videoUrl = uploadVideo.secure_url;
      updatedLecture.publicId = uploadVideo.public_id;
    }

    const upldatedLecture = await Lecture.findByIdAndUpdate(
      lectureId,
      updatedLecture,
      { new: true }
    );
    return res.status(200).json({
      upldatedLecture,
      success: true,
      msg: "lecture upldate successfully !",
    });
  } catch (error) {
    console.log("update lecture  ----->>> error", error);
    if (lectureVideo) {
      fs.unlinkSync(lectureVideo.path);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture",
    });
  }
};

// delete lecture
export const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.query;
    if (!lectureId) {
      return res.status(400).json({
        msg: "lecture Id is required",
      });
    }

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(400).json({
        msg: "lecture not found !",
      });
    }
    if (lecture.publicId) {
      await deleteCloudinaryMedia(lecture.publicId);
    }

    return res.status(200).json({
      lecture,
      success: true,
      msg: "lecture has been deleted successfully !",
    });
  } catch (error) {
    console.log("Delete lecture  ----->>> error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to Delete lecture",
    });
  }
};

// toggle logic for publish and unpublish course
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId, isPublish } = req.query;
    if (!isPublish || !courseId) {
      return res.status(400).json({
        msg: "courseId or isPublish are required !",
      });
    }

    let course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(400).json({
        msg: "course not found !",
      });
    }
    course.isPublished = isPublish ? true : false;

    await course.save();

    return res.status(200).json({
      course,
      success: true,
      msg: `course is ${course.isPublished ? "Published" : "Unpublished"}`,
    });
  } catch (error) {
    console.log(" publish/unpublish  ----->>> error", error);

    return res.status(500).json({
      success: false,
      message: "Failed to publish/unpublish course",
    });
  }
};

// get published courses
export const getPublishedCourses = async (req, res) => {
  try {
    let courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name email photoUrl",
    });
    if (!courses) {
      return res.status(400).json({
        msg: "course not found !",
      });
    }
    return res.status(200).json({
      courses,
      success: true,
    });
  } catch (error) {
    console.log("get publish courses ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get publish courses",
    });
  }
};

// get published courses
export const getPublishedCoursesDetails = async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      console.log("----------->>courseId", courseId);
      return res.status(400).json({
        msg: "courseId are required !",
      });
    }

    let course = await Course.findById({ _id: courseId });
    if (!course) {
      return res.status(400).json({
        msg: "course not found !",
      });
    }
    if (course.lectures) {
      let lecture = await Lecture.find({ _id: { $in: course.lectures } });
      course.lectures = lecture;
    }
    return res.status(200).json({
      course,
      success: true,
    });
  } catch (error) {
    console.log("get publish courses ----->>> error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get publish courses",
    });
  }
};
