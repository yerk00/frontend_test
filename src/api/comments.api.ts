import { apiClient } from "./client";
import type { Comment } from "../types/api.types";

export const getComments = async (): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>("/comments");
  return response.data;
};

export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>("/comments", {
    params: { postId },
  });

  return response.data;
};