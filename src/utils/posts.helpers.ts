import type { Comment, Post, User } from "../types/api.types";
import type { PostListItem } from "../types/view-models.types";

export const createUsersMap = (users: User[]): Record<number, User> => {
  return users.reduce<Record<number, User>>((accumulator, user) => {
    accumulator[user.id] = user;
    return accumulator;
  }, {});
};

export const createCommentsCountMap = (comments: Comment[]): Record<number, number> => {
  return comments.reduce<Record<number, number>>((accumulator, comment) => {
    accumulator[comment.postId] = (accumulator[comment.postId] ?? 0) + 1;
    return accumulator;
  }, {});
};

export const buildPostListItems = (
  posts: Post[],
  users: User[],
  comments: Comment[]
): PostListItem[] => {
  const usersMap = createUsersMap(users);
  const commentsCountMap = createCommentsCountMap(comments);

  return posts.map((post) => ({
    ...post,
    authorName: usersMap[post.userId]?.name ?? "Autor desconocido",
    commentsCount: commentsCountMap[post.id] ?? 0,
  }));
};

export const filterPosts = (
  posts: PostListItem[],
  searchTerm: string,
  selectedUserId: number | null
): PostListItem[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.body.toLowerCase().includes(normalizedSearch);

    const matchesUser = selectedUserId === null || post.userId === selectedUserId;

    return matchesSearch && matchesUser;
  });
};

export const paginateItems = <T,>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return items.slice(startIndex, endIndex);
};