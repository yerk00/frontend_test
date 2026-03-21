import { useEffect } from "react";
import { getPostById } from "../api/posts.api";
import { getCommentsByPostId } from "../api/comments.api";
import { getUsers } from "../api/users.api";
import type { PostDetailView } from "../types/view-models.types";
import { useAsyncState } from "./useAsyncState";

interface UsePostDetailResult {
  data: PostDetailView | null;
  isLoading: boolean;
  error: string | null;
}

export const usePostDetail = (postId: number | null): UsePostDetailResult => {
  const { data, isLoading, error, run } = useAsyncState<PostDetailView>();

  useEffect(() => {
    if (postId === null) {
      return;
    }

    const loadPostDetail = async (): Promise<PostDetailView> => {
      const [post, comments, users] = await Promise.all([
        getPostById(postId),
        getCommentsByPostId(postId),
        getUsers(),
      ]);

      const author = users.find((user) => user.id === post.userId) ?? null;

      return {
        post,
        author,
        comments,
      };
    };

    void run(loadPostDetail);
  }, [postId, run]);

  return {
    data,
    isLoading: postId === null ? false : isLoading,
    error,
  };
};