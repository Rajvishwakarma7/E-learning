import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_REACT_CLIENT_URL;
const COURSE_API = `${BASE_URL}course/`;
export const courseApi = createApi({
  reducerPath: "courseApi",
  tagType: ["Refetch_creator_course"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_creator_course"],
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: "/publishded-courses",
        method: "GET",
      }),
    }),

    getCreatorCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Refetch_creator_course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/?courseId=${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Refetch_creator_course"],
    }),

    getCourseById: builder.query({
      query: (courseId) => ({
        url: `getcoursebyid/?courseId=${courseId}`,
        method: "GET",
      }),
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/lecture?courseId=${courseId}`,
        method: "POST",
        body: { lectureTitle },
      }),
    }),
    getLecture: builder.query({
      query: (courseId) => ({
        url: `/lecture?courseId=${courseId}`,
        method: "GET",
      }),
    }),
    deleteLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture?lectureId=${lectureId}`,
        method: "DELETE",
      }),
    }),
    publishCourse: builder.mutation({
      query: ({ isPublish, courseId }) => ({
        url: `/course-publish?courseId=${courseId}&isPublish=${isPublish}`,
        method: "PUT",
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course-publish?courseId=${courseId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetPublishedCoursesQuery,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetLectureQuery,
  useDeleteLectureMutation,
  usePublishCourseMutation,

  // get course details
  useGetCourseDetailWithStatusQuery,
} = courseApi;
