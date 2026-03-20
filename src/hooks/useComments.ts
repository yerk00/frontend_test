import { useEffect, useState } from "react";
import { getComments } from "../api/comments.api";
import type { Comment } from "../types/api.types";

interface UseCommentsResult {
  data: Comment[];
  isLoading: boolean;
  error: string | null;
}

export const useComments = (): UseCommentsResult => {
  const [data, setData] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const comments = await getComments();

        if (!isMounted) return;
        setData(comments);
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error ? error.message : "No se pudieron cargar los comentarios";

        setError(message);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadComments();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};