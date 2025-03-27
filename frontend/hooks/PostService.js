import { axiosInstance } from "../src/lib/axios";

export const getPosts = async ({ filterKey }) => {
  const filterUrl = filterKey ? `content=${filterKey}` : "";

  const res = await axiosInstance.get(`/posts?${filterUrl}`);
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("users/suggestions");
  return res.data;
};
