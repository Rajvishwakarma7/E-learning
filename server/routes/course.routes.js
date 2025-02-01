import express from "express";
import {
  createCourse,
  createLecture,
  deleteLecture,
  editCourse,
  getCourseById,
  getCourseLecture,
  getCreatorCourse,
  getPublishedCourses,
  getPublishedCoursesDetails,
  togglePublishCourse,
  updateLecture,
} from "../controllers/course.controllers.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getCreatorCourse);
router.route("/publishded-courses").get(getPublishedCourses);
router
  .route("/")
  .put(isAuthenticated, upload.single("courseThumbnailImg"), editCourse);
router.route("/getcoursebyid").get(isAuthenticated, getCourseById);

router.route("/lecture").post(isAuthenticated, createLecture);
router.route("/lecture").get(isAuthenticated, getCourseLecture);
router
  .route("/lecture")
  .put(isAuthenticated, upload.single("lectureVideo"), updateLecture);
router.route("/lecture").delete(isAuthenticated, deleteLecture);
router.route("/course-publish").put(isAuthenticated, togglePublishCourse);

router.route("/course-publish").get(getPublishedCoursesDetails);

export default router;
