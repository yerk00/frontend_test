import { apiClient } from "./client";
import type { User } from "../types/api.types";

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>("/users");
  return response.data;
};