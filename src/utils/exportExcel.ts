import * as XLSX from "xlsx";
import type { User } from "../types/api.types";
import type { PostListItem } from "../types/view-models.types";

interface ExportPostsExcelParams {
  posts: PostListItem[];
  users: User[];
}

type WorksheetRow = Record<string, string | number>;

const calculateColumnWidths = (rows: WorksheetRow[]): XLSX.ColInfo[] => {
  if (rows.length === 0) {
    return [];
  }

  const headers = Object.keys(rows[0]);

  return headers.map((header) => {
    const maxContentLength = rows.reduce((maxLength, row) => {
      const cellValue = String(row[header] ?? "");
      return Math.max(maxLength, cellValue.length);
    }, header.length);

    return {
      wch: Math.min(Math.max(maxContentLength + 2, 12), 48),
    };
  });
};

const buildPostsSheet = (posts: PostListItem[]): XLSX.WorkSheet => {
  const rows: WorksheetRow[] = posts.map((post) => ({
    ID: post.id,
    Título: post.title,
    Cuerpo: post.body,
    Usuario: post.authorName,
    "Nº Comentarios": post.commentsCount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = calculateColumnWidths(rows);

  return worksheet;
};

const buildUsersSheet = (users: User[]): XLSX.WorkSheet => {
  const rows: WorksheetRow[] = users.map((user) => ({
    ID: user.id,
    Nombre: user.name,
    Email: user.email,
    Ciudad: user.address.city,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = calculateColumnWidths(rows);

  return worksheet;
};

export const exportPostsToExcel = ({
  posts,
  users,
}: ExportPostsExcelParams): void => {
  const workbook = XLSX.utils.book_new();

  const postsSheet = buildPostsSheet(posts);
  const usersSheet = buildUsersSheet(users);

  XLSX.utils.book_append_sheet(workbook, postsSheet, "Publicaciones");
  XLSX.utils.book_append_sheet(workbook, usersSheet, "Usuarios");

  XLSX.writeFile(workbook, "reporte-publicaciones.xlsx", {
    compression: true,
  });
};