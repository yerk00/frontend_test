import { useEffect, useState } from "react";
import { getPosts } from "../api/posts.api";
import type { Post } from "../types/api.types";

interface UsePostsResult {
  data: Post[];
  isLoading: boolean;
  error: string | null;
}

export const usePosts = (): UsePostsResult => {
  const [data, setData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const posts = await getPosts();

        if (!isMounted) return;
        setData(posts);
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error ? error.message : "No se pudieron cargar las publicaciones";

        setError(message);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};