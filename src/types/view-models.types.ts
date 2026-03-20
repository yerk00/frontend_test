import type { Comment, Post, User } from "./api.types";

export interface PostListItem extends Post {
  authorName: string;
  commentsCount: number;
}

export interface PostDetailView {
  post: Post;
  author: User | null;
  comments: Comment[];
}