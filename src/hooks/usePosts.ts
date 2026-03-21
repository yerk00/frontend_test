import { useEffect } from "react";
import { getPosts } from "../api/posts.api";
import type { Post } from "../types/api.types";
import { useAsyncState } from "./useAsyncState";

interface UsePostsResult {
  data: Post[];
  isLoading: boolean;
  error: string | null;
}

export const usePosts = (): UsePostsResult => {
  const { data, isLoading, error, run } = useAsyncState<Post[]>();

  useEffect(() => {
    void run(getPosts);
  }, [run]);

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};