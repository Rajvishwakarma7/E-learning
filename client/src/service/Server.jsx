import axios from "axios";
const apiservice = axios.create({
  baseURL: "http://localhost:8080/api/v1/course/",
  withCredentials: true,
  timeout: 50000, // ml second (50s)
});

export default apiservice;
