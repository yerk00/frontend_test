import { useEffect } from "react";
import { getUsers } from "../api/users.api";
import type { User } from "../types/api.types";
import { useAsyncState } from "./useAsyncState";

interface UseUsersResult {
  data: User[];
  isLoading: boolean;
  error: string | null;
}

export const useUsers = (): UseUsersResult => {
  const { data, isLoading, error, run } = useAsyncState<User[]>();

  useEffect(() => {
    void run(getUsers);
  }, [run]);

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};