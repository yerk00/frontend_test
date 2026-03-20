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