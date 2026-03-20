import { useEffect, useState } from "react";
import { getUsers } from "../api/users.api";
import type { User } from "../types/api.types";

interface UseUsersResult {
  data: User[];
  isLoading: boolean;
  error: string | null;
}

export const useUsers = (): UseUsersResult => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const users = await getUsers();

        if (!isMounted) return;
        setData(users);
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error ? error.message : "No se pudieron cargar los usuarios";

        setError(message);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
};