import { axiosInstance } from "../src/lib/axios";

export const getPosts = async () => {
  const res = await axiosInstance.get("/posts");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("users/suggestions");
  return res.data;
};
