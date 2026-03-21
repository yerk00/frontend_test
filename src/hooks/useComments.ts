import { useEffect } from "react";
import { getComments } from "../api/comments.api";
import type { Comment } from "../types/api.types";
import { useAsyncState } from "./useAsyncState";

interface UseCommentsResult {
  data: Comment[];
  isLoading: boolean;
  error: string | null;
}

export const useComments = (): UseCommentsResult => {
  const { data, isLoading, error, run } = useAsyncState<Comment[]>();

  useEffect(() => {
    void run(getComments);
  }, [run]);

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};