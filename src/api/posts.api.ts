import { apiClient } from "./client";
import type { Post } from "../types/api.types";

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>("/posts");
  return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${id}`);
  return response.data;
};